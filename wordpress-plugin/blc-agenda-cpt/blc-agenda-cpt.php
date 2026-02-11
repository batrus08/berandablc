<?php
/**
 * Plugin Name: BLC Agenda CPT
 * Description: Custom post type Agenda dengan meta field untuk kebutuhan headless frontend.
 * Version: 1.1.0
 * Author: BLC
 */

if (!defined('ABSPATH')) {
    exit;
}

const BLC_AGENDA_META_NONCE_ACTION = 'blc_agenda_meta_save';
const BLC_AGENDA_META_NONCE_NAME = 'blc_agenda_meta_nonce';

function blc_agenda_get_meta_fields()
{
    return [
        'start_date' => [
            'label' => 'Tanggal Mulai',
            'required' => true,
            'sanitize_callback' => 'blc_agenda_sanitize_date',
        ],
        'end_date' => [
            'label' => 'Tanggal Selesai',
            'required' => false,
            'sanitize_callback' => 'blc_agenda_sanitize_date_or_empty',
        ],
        'time' => [
            'label' => 'Waktu',
            'required' => false,
            'sanitize_callback' => 'sanitize_text_field',
        ],
        'location' => [
            'label' => 'Lokasi',
            'required' => false,
            'sanitize_callback' => 'sanitize_text_field',
        ],
        'register_url' => [
            'label' => 'URL Pendaftaran',
            'required' => false,
            'sanitize_callback' => 'blc_agenda_sanitize_url_or_empty',
        ],
        'minutes_attachment_id' => [
            'label' => 'Lampiran Notulen (PDF)',
            'required' => false,
            'sanitize_callback' => 'absint',
        ],
        'report_attachment_id' => [
            'label' => 'Lampiran Laporan (PDF)',
            'required' => false,
            'sanitize_callback' => 'absint',
        ],
    ];
}

function blc_agenda_sanitize_date($value)
{
    $value = sanitize_text_field((string) $value);

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
        return '';
    }

    [$year, $month, $day] = array_map('intval', explode('-', $value));
    if (!checkdate($month, $day, $year)) {
        return '';
    }

    return sprintf('%04d-%02d-%02d', $year, $month, $day);
}

function blc_agenda_sanitize_date_or_empty($value)
{
    $value = trim((string) $value);
    if ($value === '') {
        return '';
    }

    return blc_agenda_sanitize_date($value);
}

function blc_agenda_sanitize_url_or_empty($value)
{
    $value = trim((string) $value);
    if ($value === '') {
        return '';
    }

    return esc_url_raw($value);
}

function blc_agenda_meta_auth_callback($allowed, $meta_key, $post_id)
{
    if (current_user_can('edit_post', $post_id)) {
        return true;
    }

    $post = get_post($post_id);
    if (!$post || $post->post_type !== 'agenda') {
        return false;
    }

    return $post->post_status === 'publish';
}

add_action('init', function () {
    $labels = [
        'name' => 'Agenda',
        'singular_name' => 'Agenda',
        'menu_name' => 'Agenda',
        'name_admin_bar' => 'Agenda',
        'add_new' => 'Tambah Baru',
        'add_new_item' => 'Tambah Agenda Baru',
        'new_item' => 'Agenda Baru',
        'edit_item' => 'Edit Agenda',
        'view_item' => 'Lihat Agenda',
        'all_items' => 'Semua Agenda',
        'search_items' => 'Cari Agenda',
        'not_found' => 'Agenda tidak ditemukan',
        'not_found_in_trash' => 'Tidak ada agenda di tong sampah',
    ];

    register_post_type('agenda', [
        'labels' => $labels,
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-calendar-alt',
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail'],
        'rewrite' => ['slug' => 'agenda'],
        'has_archive' => true,
        'map_meta_cap' => true,
    ]);
});

add_action('init', function () {
    foreach (blc_agenda_get_meta_fields() as $key => $field) {
        register_post_meta('agenda', $key, [
            'type' => $key === 'minutes_attachment_id' || $key === 'report_attachment_id' ? 'integer' : 'string',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => $field['sanitize_callback'],
            'auth_callback' => 'blc_agenda_meta_auth_callback',
        ]);
    }
});

add_action('add_meta_boxes', function () {
    add_meta_box(
        'blc_agenda_meta_box',
        'Detail Agenda',
        'blc_agenda_render_meta_box',
        'agenda',
        'normal',
        'high'
    );
});

function blc_agenda_render_meta_box($post)
{
    if (!current_user_can('edit_post', $post->ID)) {
        return;
    }

    wp_nonce_field(BLC_AGENDA_META_NONCE_ACTION, BLC_AGENDA_META_NONCE_NAME);

    $meta = [];
    foreach (array_keys(blc_agenda_get_meta_fields()) as $key) {
        $meta[$key] = get_post_meta($post->ID, $key, true);
    }

    $minutes_url = $meta['minutes_attachment_id'] ? wp_get_attachment_url((int) $meta['minutes_attachment_id']) : '';
    $report_url = $meta['report_attachment_id'] ? wp_get_attachment_url((int) $meta['report_attachment_id']) : '';
    ?>
    <style>
        .blc-agenda-field { margin-bottom: 12px; }
        .blc-agenda-field label { display: block; font-weight: 600; margin-bottom: 4px; }
        .blc-agenda-field input[type="text"],
        .blc-agenda-field input[type="date"],
        .blc-agenda-field input[type="url"] { width: 100%; max-width: 420px; }
        .blc-agenda-media { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .blc-agenda-file-url { color: #50575e; font-size: 12px; word-break: break-all; }
    </style>

    <div class="blc-agenda-field">
        <label for="blc-start-date">Tanggal Mulai *</label>
        <input id="blc-start-date" name="start_date" type="date" required value="<?php echo esc_attr((string) $meta['start_date']); ?>" />
    </div>

    <div class="blc-agenda-field">
        <label for="blc-end-date">Tanggal Selesai</label>
        <input id="blc-end-date" name="end_date" type="date" value="<?php echo esc_attr((string) $meta['end_date']); ?>" />
    </div>

    <div class="blc-agenda-field">
        <label for="blc-time">Waktu</label>
        <input id="blc-time" name="time" type="text" placeholder="Contoh: 19:00 - 21:00 WIB" value="<?php echo esc_attr((string) $meta['time']); ?>" />
    </div>

    <div class="blc-agenda-field">
        <label for="blc-location">Lokasi</label>
        <input id="blc-location" name="location" type="text" placeholder="Contoh: Auditorium FH" value="<?php echo esc_attr((string) $meta['location']); ?>" />
    </div>

    <div class="blc-agenda-field">
        <label for="blc-register-url">URL Pendaftaran</label>
        <input id="blc-register-url" name="register_url" type="url" placeholder="https://" value="<?php echo esc_attr((string) $meta['register_url']); ?>" />
    </div>

    <div class="blc-agenda-field">
        <label>Lampiran Notulen (PDF)</label>
        <div class="blc-agenda-media">
            <input type="hidden" id="blc-minutes-attachment-id" name="minutes_attachment_id" value="<?php echo esc_attr((string) $meta['minutes_attachment_id']); ?>" />
            <button type="button" class="button blc-agenda-select-file" data-target="minutes">Pilih PDF</button>
            <button type="button" class="button blc-agenda-clear-file" data-target="minutes">Hapus</button>
            <span class="blc-agenda-file-url" id="blc-minutes-file-url"><?php echo esc_html((string) $minutes_url); ?></span>
        </div>
    </div>

    <div class="blc-agenda-field">
        <label>Lampiran Laporan (PDF)</label>
        <div class="blc-agenda-media">
            <input type="hidden" id="blc-report-attachment-id" name="report_attachment_id" value="<?php echo esc_attr((string) $meta['report_attachment_id']); ?>" />
            <button type="button" class="button blc-agenda-select-file" data-target="report">Pilih PDF</button>
            <button type="button" class="button blc-agenda-clear-file" data-target="report">Hapus</button>
            <span class="blc-agenda-file-url" id="blc-report-file-url"><?php echo esc_html((string) $report_url); ?></span>
        </div>
    </div>

    <script>
        (function () {
            const openMediaFrame = (target) => {
                const frame = wp.media({
                    title: 'Pilih berkas PDF',
                    button: { text: 'Gunakan berkas ini' },
                    multiple: false,
                    library: { type: 'application/pdf' }
                });

                frame.on('select', function () {
                    const attachment = frame.state().get('selection').first().toJSON();
                    const idInput = document.getElementById(`blc-${target}-attachment-id`);
                    const urlText = document.getElementById(`blc-${target}-file-url`);
                    idInput.value = String(attachment.id || '');
                    urlText.textContent = attachment.url || '';
                });

                frame.open();
            };

            document.querySelectorAll('.blc-agenda-select-file').forEach((button) => {
                button.addEventListener('click', function () {
                    openMediaFrame(button.getAttribute('data-target'));
                });
            });

            document.querySelectorAll('.blc-agenda-clear-file').forEach((button) => {
                button.addEventListener('click', function () {
                    const target = button.getAttribute('data-target');
                    document.getElementById(`blc-${target}-attachment-id`).value = '';
                    document.getElementById(`blc-${target}-file-url`).textContent = '';
                });
            });
        })();
    </script>
    <?php
}

add_action('admin_enqueue_scripts', function ($hook) {
    global $post_type;

    if (($hook === 'post.php' || $hook === 'post-new.php') && $post_type === 'agenda') {
        wp_enqueue_media();
    }
});

add_action('save_post_agenda', function ($post_id, $post) {
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
        return;
    }

    if (!isset($_POST[BLC_AGENDA_META_NONCE_NAME])) {
        return;
    }

    if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST[BLC_AGENDA_META_NONCE_NAME])), BLC_AGENDA_META_NONCE_ACTION)) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    foreach (blc_agenda_get_meta_fields() as $key => $field) {
        $raw = isset($_POST[$key]) ? wp_unslash($_POST[$key]) : '';
        $value = call_user_func($field['sanitize_callback'], $raw);

        if ($key === 'start_date' && $value === '') {
            continue;
        }

        if ($value === '' || $value === 0) {
            delete_post_meta($post_id, $key);
            continue;
        }

        update_post_meta($post_id, $key, $value);
    }
}, 10, 2);

add_action('rest_api_init', function () {
    register_rest_field('agenda', 'poster_url', [
        'get_callback' => function ($object) {
            $thumbnail_id = get_post_thumbnail_id((int) $object['id']);
            if (!$thumbnail_id) {
                return '';
            }

            return (string) wp_get_attachment_image_url($thumbnail_id, 'full');
        },
        'schema' => [
            'description' => 'URL poster agenda dari featured image.',
            'type' => 'string',
            'context' => ['view', 'edit'],
        ],
    ]);

    register_rest_field('agenda', 'minutes_url', [
        'get_callback' => function ($object) {
            $attachment_id = (int) get_post_meta((int) $object['id'], 'minutes_attachment_id', true);
            if (!$attachment_id) {
                return '';
            }

            return (string) wp_get_attachment_url($attachment_id);
        },
        'schema' => [
            'description' => 'URL notulen agenda.',
            'type' => 'string',
            'context' => ['view', 'edit'],
        ],
    ]);

    register_rest_field('agenda', 'report_url', [
        'get_callback' => function ($object) {
            $attachment_id = (int) get_post_meta((int) $object['id'], 'report_attachment_id', true);
            if (!$attachment_id) {
                return '';
            }

            return (string) wp_get_attachment_url($attachment_id);
        },
        'schema' => [
            'description' => 'URL laporan agenda.',
            'type' => 'string',
            'context' => ['view', 'edit'],
        ],
    ]);

    $simple_fields = ['start_date', 'end_date', 'time', 'location', 'register_url'];

    foreach ($simple_fields as $field_name) {
        register_rest_field('agenda', $field_name, [
            'get_callback' => function ($object) use ($field_name) {
                return (string) get_post_meta((int) $object['id'], $field_name, true);
            },
            'schema' => [
                'description' => sprintf('Field agenda: %s', $field_name),
                'type' => 'string',
                'context' => ['view', 'edit'],
            ],
        ]);
    }
});

add_filter('manage_agenda_posts_columns', function ($columns) {
    $new_columns = [];

    foreach ($columns as $key => $label) {
        $new_columns[$key] = $label;
        if ($key === 'title') {
            $new_columns['start_date'] = 'Tanggal Mulai';
            $new_columns['location'] = 'Lokasi';
        }
    }

    return $new_columns;
});

add_action('manage_agenda_posts_custom_column', function ($column, $post_id) {
    if ($column === 'start_date') {
        $start_date = (string) get_post_meta($post_id, 'start_date', true);
        echo $start_date ? esc_html($start_date) : '—';
    }

    if ($column === 'location') {
        $location = (string) get_post_meta($post_id, 'location', true);
        echo $location ? esc_html($location) : '—';
    }
}, 10, 2);

add_filter('manage_edit-agenda_sortable_columns', function ($columns) {
    $columns['start_date'] = 'start_date';
    return $columns;
});

add_action('pre_get_posts', function ($query) {
    if (!is_admin() || !$query->is_main_query()) {
        return;
    }

    if ($query->get('post_type') !== 'agenda') {
        return;
    }

    if ($query->get('orderby') === 'start_date') {
        $query->set('meta_key', 'start_date');
        $query->set('orderby', 'meta_value');
        $query->set('meta_type', 'DATE');
    }
});
