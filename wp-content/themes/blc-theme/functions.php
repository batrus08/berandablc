<?php
/**
 * Theme functions for BLC front page.
 */

// Ganti sesuai blog_id subsite news jika berbeda.
if (!defined('BLC_NEWS_BLOG_ID')) {
    define('BLC_NEWS_BLOG_ID', 2);
}

/**
 * Default konten beranda agar dapat dikelola melalui WP Admin.
 *
 * @return array<string, mixed>
 */
function blc_get_default_home_settings() {
    return [
        'news_blog_id'       => BLC_NEWS_BLOG_ID,
        'hero_eyebrow'       => 'Kampus Fakultas Hukum',
        'hero_title'         => 'Business Law Community Fakultas Hukum',
        'hero_lead'          => 'Kolaborasi akademisi dan praktisi dalam kajian hukum bisnis, publikasi berkualitas, serta advokasi kebijakan.',
        'hero_primary_label' => 'Baca Publikasi Terbaru',
        'hero_primary_url'   => 'https://news.meoww.my.id/',
        'hero_secondary_label' => 'Kerja Sama',
        'hero_secondary_url'   => '/kerja-sama/',
        'highlights'           => [
            ['label' => 'Fokus', 'text' => 'Regulasi bisnis, digital economy, dan governance korporasi.'],
            ['label' => 'Kolaborasi', 'text' => 'Menghubungkan riset kampus dengan kebutuhan industri.'],
            ['label' => 'Insight', 'text' => 'Publikasi rutin dari dosen, mahasiswa, dan mitra profesional.'],
        ],
        'quick_access' => [
            ['title' => 'Publikasi Bulanan', 'description' => 'Ringkasan isu hukum bisnis terkini setiap bulan.', 'url' => '/publikasi-bulanan/'],
            ['title' => 'Opini &amp; Esai', 'description' => 'Pandangan kritis dosen dan mahasiswa tentang dinamika regulasi.', 'url' => '/opini-esai/'],
            ['title' => 'Kajian Hukum', 'description' => 'Analisis mendalam regulasi, studi kasus, dan implikasi bisnis.', 'url' => '/kajian-hukum/'],
            ['title' => 'Dokumen PDF', 'description' => 'Whitepaper, policy brief, dan materi seminar siap unduh.', 'url' => '/dokumen/'],
        ],
        'cta_eyebrow'          => 'Kolaborasi Strategis',
        'cta_title'            => 'Mari wujudkan inisiatif hukum bisnis yang berdampak',
        'cta_body'             => 'Terbuka untuk riset bersama, penyusunan policy brief, maupun pelatihan korporasi.',
        'cta_primary_label'    => 'Ajukan Kerja Sama',
        'cta_primary_url'      => '/kerja-sama/',
        'cta_secondary_label'  => 'Hubungi Kami',
        'cta_secondary_url'    => '/kontak/',
    ];
}

/**
 * Ambil konfigurasi beranda yang sudah digabung dengan default.
 *
 * @return array<string, mixed>
 */
function blc_home_settings() {
    $defaults = blc_get_default_home_settings();
    $options  = get_option('blc_home_settings', []);

    if (!is_array($options)) {
        $options = [];
    }

    return wp_parse_args($options, $defaults);
}

/**
 * Sanitize JSON list fields.
 *
 * @param string                $value    JSON string from textarea.
 * @param array<int, string>    $allowed  Allowed keys per item.
 * @param array<int, array>     $default  Default fallback.
 * @return array<int, array<string, string>>
 */
function blc_sanitize_json_list($value, $allowed, $default) {
    if (empty($value)) {
        return $default;
    }

    $decoded = json_decode(wp_unslash($value), true);

    if (!is_array($decoded)) {
        return $default;
    }

    $sanitized = [];

    foreach ($decoded as $item) {
        if (!is_array($item)) {
            continue;
        }

        $clean_item = [];

        foreach ($allowed as $key) {
            if (!isset($item[$key])) {
                continue;
            }

            $value = is_string($item[$key]) ? $item[$key] : wp_json_encode($item[$key]);
            $clean_item[$key] = ('url' === $key) ? esc_url_raw($value) : sanitize_text_field($value);
        }

        if (!empty($clean_item)) {
            $sanitized[] = $clean_item;
        }
    }

    return !empty($sanitized) ? $sanitized : $default;
}

/**
 * Sanitize option input.
 *
 * @param array<string, mixed> $input Raw input from settings form.
 * @return array<string, mixed>
 */
function blc_sanitize_home_settings($input) {
    $defaults  = blc_get_default_home_settings();
    $sanitized = [];

    $sanitized['news_blog_id'] = isset($input['news_blog_id']) ? absint($input['news_blog_id']) : $defaults['news_blog_id'];

    $sanitized['hero_eyebrow']       = isset($input['hero_eyebrow']) ? sanitize_text_field($input['hero_eyebrow']) : $defaults['hero_eyebrow'];
    $sanitized['hero_title']         = isset($input['hero_title']) ? sanitize_text_field($input['hero_title']) : $defaults['hero_title'];
    $sanitized['hero_lead']          = isset($input['hero_lead']) ? wp_kses_post($input['hero_lead']) : $defaults['hero_lead'];
    $sanitized['hero_primary_label'] = isset($input['hero_primary_label']) ? sanitize_text_field($input['hero_primary_label']) : $defaults['hero_primary_label'];
    $sanitized['hero_primary_url']   = isset($input['hero_primary_url']) ? esc_url_raw($input['hero_primary_url']) : $defaults['hero_primary_url'];
    $sanitized['hero_secondary_label'] = isset($input['hero_secondary_label']) ? sanitize_text_field($input['hero_secondary_label']) : $defaults['hero_secondary_label'];
    $sanitized['hero_secondary_url']   = isset($input['hero_secondary_url']) ? esc_url_raw($input['hero_secondary_url']) : $defaults['hero_secondary_url'];

    $sanitized['highlights'] = blc_sanitize_json_list(
        isset($input['highlights']) ? $input['highlights'] : '',
        ['label', 'text'],
        $defaults['highlights']
    );

    $sanitized['quick_access'] = blc_sanitize_json_list(
        isset($input['quick_access']) ? $input['quick_access'] : '',
        ['title', 'description', 'url'],
        $defaults['quick_access']
    );

    $sanitized['cta_eyebrow']         = isset($input['cta_eyebrow']) ? sanitize_text_field($input['cta_eyebrow']) : $defaults['cta_eyebrow'];
    $sanitized['cta_title']           = isset($input['cta_title']) ? sanitize_text_field($input['cta_title']) : $defaults['cta_title'];
    $sanitized['cta_body']            = isset($input['cta_body']) ? wp_kses_post($input['cta_body']) : $defaults['cta_body'];
    $sanitized['cta_primary_label']   = isset($input['cta_primary_label']) ? sanitize_text_field($input['cta_primary_label']) : $defaults['cta_primary_label'];
    $sanitized['cta_primary_url']     = isset($input['cta_primary_url']) ? esc_url_raw($input['cta_primary_url']) : $defaults['cta_primary_url'];
    $sanitized['cta_secondary_label'] = isset($input['cta_secondary_label']) ? sanitize_text_field($input['cta_secondary_label']) : $defaults['cta_secondary_label'];
    $sanitized['cta_secondary_url']   = isset($input['cta_secondary_url']) ? esc_url_raw($input['cta_secondary_url']) : $defaults['cta_secondary_url'];

    return $sanitized;
}

/**
 * Tambahkan menu admin untuk mengelola konten beranda.
 */
function blc_add_home_settings_page() {
    add_menu_page(
        __('Beranda BLC', 'blc'),
        __('Beranda BLC', 'blc'),
        'manage_options',
        'blc-home-settings',
        'blc_render_home_settings_page',
        'dashicons-admin-home',
        58
    );
}
add_action('admin_menu', 'blc_add_home_settings_page');

/**
 * Registrasi setting dan field.
 */
function blc_register_home_settings() {
    register_setting('blc_home', 'blc_home_settings', 'blc_sanitize_home_settings');

    add_settings_section(
        'blc_home_content',
        __('Konten Beranda', 'blc'),
        '__return_false',
        'blc-home-settings'
    );

    add_settings_field(
        'blc_news_blog_id',
        __('ID Subsite Berita', 'blc'),
        'blc_render_text_field',
        'blc-home-settings',
        'blc_home_content',
        [
            'id'          => 'news_blog_id',
            'type'        => 'number',
            'description' => __('Isi 0 bila ingin memakai blog utama; default 2 untuk subsite news.', 'blc'),
        ]
    );

    add_settings_field(
        'blc_hero_texts',
        __('Hero', 'blc'),
        'blc_render_hero_fields',
        'blc-home-settings',
        'blc_home_content'
    );

    add_settings_field(
        'blc_highlights',
        __('Highlight (JSON)', 'blc'),
        'blc_render_json_textarea',
        'blc-home-settings',
        'blc_home_content',
        [
            'id'          => 'highlights',
            'placeholder' => wp_json_encode(blc_get_default_home_settings()['highlights'], JSON_PRETTY_PRINT),
            'description' => __('Format array objek dengan kunci label dan text.', 'blc'),
        ]
    );

    add_settings_field(
        'blc_quick_access',
        __('Akses Cepat (JSON)', 'blc'),
        'blc_render_json_textarea',
        'blc-home-settings',
        'blc_home_content',
        [
            'id'          => 'quick_access',
            'placeholder' => wp_json_encode(blc_get_default_home_settings()['quick_access'], JSON_PRETTY_PRINT),
            'description' => __('Array objek dengan title, description, dan url.', 'blc'),
        ]
    );

    add_settings_field(
        'blc_cta',
        __('CTA Band', 'blc'),
        'blc_render_cta_fields',
        'blc-home-settings',
        'blc_home_content'
    );
}
add_action('admin_init', 'blc_register_home_settings');

/**
 * Render text field helper.
 *
 * @param array<string, mixed> $args Field attributes.
 */
function blc_render_text_field($args) {
    $settings = blc_home_settings();
    $id       = $args['id'];
    $type     = isset($args['type']) ? $args['type'] : 'text';
    $value    = isset($settings[$id]) ? $settings[$id] : '';
    ?>
    <input type="<?php echo esc_attr($type); ?>" name="blc_home_settings[<?php echo esc_attr($id); ?>]" id="blc_home_settings_<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($value); ?>" class="regular-text" />
    <?php if (!empty($args['description'])) : ?>
        <p class="description"><?php echo esc_html($args['description']); ?></p>
    <?php endif; ?>
    <?php
}

/**
 * Render textarea JSON helper.
 *
 * @param array<string, mixed> $args Field attributes.
 */
function blc_render_json_textarea($args) {
    $settings = blc_home_settings();
    $id       = $args['id'];
    $value    = isset($settings[$id]) ? wp_json_encode($settings[$id], JSON_PRETTY_PRINT) : '';
    ?>
    <textarea name="blc_home_settings[<?php echo esc_attr($id); ?>]" id="blc_home_settings_<?php echo esc_attr($id); ?>" rows="6" class="large-text code" placeholder="<?php echo esc_attr($args['placeholder']); ?>"><?php echo esc_textarea($value); ?></textarea>
    <?php if (!empty($args['description'])) : ?>
        <p class="description"><?php echo esc_html($args['description']); ?></p>
    <?php endif; ?>
    <?php
}

/**
 * Render field untuk hero section.
 */
function blc_render_hero_fields() {
    $settings = blc_home_settings();
    ?>
    <p>
        <label for="blc_home_settings_hero_eyebrow"><?php esc_html_e('Eyebrow', 'blc'); ?></label><br />
        <input type="text" class="regular-text" name="blc_home_settings[hero_eyebrow]" id="blc_home_settings_hero_eyebrow" value="<?php echo esc_attr($settings['hero_eyebrow']); ?>" />
    </p>
    <p>
        <label for="blc_home_settings_hero_title"><?php esc_html_e('Judul', 'blc'); ?></label><br />
        <input type="text" class="regular-text" name="blc_home_settings[hero_title]" id="blc_home_settings_hero_title" value="<?php echo esc_attr($settings['hero_title']); ?>" />
    </p>
    <p>
        <label for="blc_home_settings_hero_lead"><?php esc_html_e('Deskripsi', 'blc'); ?></label><br />
        <textarea name="blc_home_settings[hero_lead]" id="blc_home_settings_hero_lead" rows="3" class="large-text"><?php echo esc_textarea($settings['hero_lead']); ?></textarea>
    </p>
    <p>
        <label for="blc_home_settings_hero_primary_label"><?php esc_html_e('Teks tombol utama', 'blc'); ?></label><br />
        <input type="text" class="regular-text" name="blc_home_settings[hero_primary_label]" id="blc_home_settings_hero_primary_label" value="<?php echo esc_attr($settings['hero_primary_label']); ?>" />
    </p>
    <p>
        <label for="blc_home_settings_hero_primary_url"><?php esc_html_e('Link tombol utama', 'blc'); ?></label><br />
        <input type="url" class="regular-text" name="blc_home_settings[hero_primary_url]" id="blc_home_settings_hero_primary_url" value="<?php echo esc_attr($settings['hero_primary_url']); ?>" />
    </p>
    <p>
        <label for="blc_home_settings_hero_secondary_label"><?php esc_html_e('Teks tombol sekunder', 'blc'); ?></label><br />
        <input type="text" class="regular-text" name="blc_home_settings[hero_secondary_label]" id="blc_home_settings_hero_secondary_label" value="<?php echo esc_attr($settings['hero_secondary_label']); ?>" />
    </p>
    <p>
        <label for="blc_home_settings_hero_secondary_url"><?php esc_html_e('Link tombol sekunder', 'blc'); ?></label><br />
        <input type="url" class="regular-text" name="blc_home_settings[hero_secondary_url]" id="blc_home_settings_hero_secondary_url" value="<?php echo esc_attr($settings['hero_secondary_url']); ?>" />
    </p>
    <?php
}

/**
 * Render field untuk CTA band.
 */
function blc_render_cta_fields() {
    $settings = blc_home_settings();
    ?>
    <p>
        <label for="blc_home_settings_cta_eyebrow"><?php esc_html_e('Eyebrow', 'blc'); ?></label><br />
        <input type="text" class="regular-text" name="blc_home_settings[cta_eyebrow]" id="blc_home_settings_cta_eyebrow" value="<?php echo esc_attr($settings['cta_eyebrow']); ?>" />
    </p>
    <p>
        <label for="blc_home_settings_cta_title"><?php esc_html_e('Judul CTA', 'blc'); ?></label><br />
        <input type="text" class="regular-text" name="blc_home_settings[cta_title]" id="blc_home_settings_cta_title" value="<?php echo esc_attr($settings['cta_title']); ?>" />
    </p>
    <p>
        <label for="blc_home_settings_cta_body"><?php esc_html_e('Deskripsi', 'blc'); ?></label><br />
        <textarea name="blc_home_settings[cta_body]" id="blc_home_settings_cta_body" rows="3" class="large-text"><?php echo esc_textarea($settings['cta_body']); ?></textarea>
    </p>
    <p>
        <label for="blc_home_settings_cta_primary_label"><?php esc_html_e('Teks tombol utama', 'blc'); ?></label><br />
        <input type="text" class="regular-text" name="blc_home_settings[cta_primary_label]" id="blc_home_settings_cta_primary_label" value="<?php echo esc_attr($settings['cta_primary_label']); ?>" />
    </p>
    <p>
        <label for="blc_home_settings_cta_primary_url"><?php esc_html_e('Link tombol utama', 'blc'); ?></label><br />
        <input type="url" class="regular-text" name="blc_home_settings[cta_primary_url]" id="blc_home_settings_cta_primary_url" value="<?php echo esc_attr($settings['cta_primary_url']); ?>" />
    </p>
    <p>
        <label for="blc_home_settings_cta_secondary_label"><?php esc_html_e('Teks tombol sekunder', 'blc'); ?></label><br />
        <input type="text" class="regular-text" name="blc_home_settings[cta_secondary_label]" id="blc_home_settings_cta_secondary_label" value="<?php echo esc_attr($settings['cta_secondary_label']); ?>" />
    </p>
    <p>
        <label for="blc_home_settings_cta_secondary_url"><?php esc_html_e('Link tombol sekunder', 'blc'); ?></label><br />
        <input type="url" class="regular-text" name="blc_home_settings[cta_secondary_url]" id="blc_home_settings_cta_secondary_url" value="<?php echo esc_attr($settings['cta_secondary_url']); ?>" />
    </p>
    <?php
}

/**
 * Render halaman setting.
 */
function blc_render_home_settings_page() {
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('Pengaturan Beranda BLC', 'blc'); ?></h1>
        <p><?php esc_html_e('Kelola teks hero, tautan, dan data grid dalam satu halaman tanpa perlu menyunting kode.', 'blc'); ?></p>
        <form action="options.php" method="post">
            <?php
            settings_fields('blc_home');
            do_settings_sections('blc-home-settings');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

/**
 * Enqueue assets for the front page.
 */
function blc_enqueue_home_assets() {
    if (!is_front_page()) {
        return;
    }

    $style_path = get_template_directory() . '/assets/css/home.css';
    $style_version = file_exists($style_path) ? filemtime($style_path) : wp_get_theme()->get('Version');

    wp_enqueue_style(
        'blc-home',
        get_template_directory_uri() . '/assets/css/home.css',
        [],
        $style_version
    );

    $script_path = get_template_directory() . '/assets/js/home.js';
    if (file_exists($script_path)) {
        $script_version = filemtime($script_path);
        wp_enqueue_script(
            'blc-home',
            get_template_directory_uri() . '/assets/js/home.js',
            [],
            $script_version,
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'blc_enqueue_home_assets');

/**
 * Get latest news posts from the news subsite with caching.
 *
 * @param int $blog_id Blog ID for the news site.
 * @param int $limit   Number of posts to return.
 * @return array<int, array<string, mixed>>
 */
function blc_get_latest_news_posts($blog_id = null, $limit = 6) {
    $settings = blc_home_settings();
    $blog_id  = isset($blog_id) ? (int) $blog_id : (int) $settings['news_blog_id'];

    $transient_key = sprintf('blc_home_latest_news_%d_%d', $blog_id, $limit);
    $cached_posts  = get_transient($transient_key);

    if (false !== $cached_posts) {
        return $cached_posts;
    }

    $posts_data = [];
    $should_switch = function_exists('switch_to_blog') && is_multisite() && (int) $blog_id !== get_current_blog_id();

    if ($should_switch) {
        switch_to_blog($blog_id);
    }

    $news_query = new WP_Query([
        'post_type'           => 'post',
        'posts_per_page'      => $limit,
        'post_status'         => 'publish',
        'orderby'             => 'date',
        'order'               => 'DESC',
        'no_found_rows'       => true,
        'ignore_sticky_posts' => true,
    ]);

    if ($news_query->have_posts()) {
        foreach ($news_query->posts as $post) {
            $categories   = get_the_category($post->ID);
            $primary_cat  = !empty($categories) ? $categories[0]->name : __('Publikasi', 'blc');
            $posts_data[] = [
                'ID'        => $post->ID,
                'title'     => get_the_title($post),
                'permalink' => get_permalink($post),
                'date'      => get_the_date('', $post),
                'author'    => get_the_author_meta('display_name', $post->post_author),
                'excerpt'   => wp_trim_words(get_the_excerpt($post), 24, '...'),
                'category'  => $primary_cat,
                'thumbnail' => get_the_post_thumbnail_url($post, 'medium_large'),
            ];
        }
    }

    wp_reset_postdata();

    if ($should_switch) {
        restore_current_blog();
    }

    set_transient($transient_key, $posts_data, MINUTE_IN_SECONDS * 10);

    return $posts_data;
}

/**
 * Format angka bulan menjadi nama bulan Indonesia.
 *
 * @param int $month Month number (1-12).
 * @return string
 */
function blc_get_indonesian_month_name($month) {
    $months = [
        1  => 'Januari',
        2  => 'Februari',
        3  => 'Maret',
        4  => 'April',
        5  => 'Mei',
        6  => 'Juni',
        7  => 'Juli',
        8  => 'Agustus',
        9  => 'September',
        10 => 'Oktober',
        11 => 'November',
        12 => 'Desember',
    ];

    return isset($months[(int) $month]) ? $months[(int) $month] : '';
}

/**
 * Ambil agenda mendatang dari CPT agenda.
 *
 * @param int $limit Jumlah item yang ditampilkan.
 * @return array<int, array<string, string>>
 */
function blc_get_upcoming_agenda_items($limit = 3) {
    if (!post_type_exists('agenda')) {
        return [];
    }

    $limit = max(1, absint($limit));
    $today = current_time('Y-m-d');

    $agenda_query = new WP_Query([
        'post_type'      => 'agenda',
        'post_status'    => 'publish',
        'posts_per_page' => $limit,
        'meta_key'       => 'start_date',
        'orderby'        => 'meta_value',
        'order'          => 'ASC',
        'meta_query'     => [
            [
                'key'     => 'start_date',
                'value'   => $today,
                'compare' => '>=',
                'type'    => 'DATE',
            ],
        ],
        'no_found_rows'  => true,
    ]);

    if (!$agenda_query->have_posts()) {
        return [];
    }

    $agenda_items = [];

    foreach ($agenda_query->posts as $agenda_post) {
        $start_date = (string) get_post_meta($agenda_post->ID, 'start_date', true);
        $timestamp  = strtotime($start_date);

        if (empty($timestamp)) {
            continue;
        }

        $excerpt = has_excerpt($agenda_post) ? get_the_excerpt($agenda_post) : wp_trim_words(wp_strip_all_tags($agenda_post->post_content), 24, '...');

        $agenda_items[] = [
            'day'          => wp_date('j', $timestamp),
            'month'        => blc_get_indonesian_month_name((int) wp_date('n', $timestamp)),
            'title'        => get_the_title($agenda_post),
            'text'         => $excerpt,
            'summary'      => $excerpt,
            'permalink'    => get_permalink($agenda_post),
            'location'     => (string) get_post_meta($agenda_post->ID, 'location', true),
            'time'         => (string) get_post_meta($agenda_post->ID, 'time', true),
            'image_url'    => (string) get_the_post_thumbnail_url($agenda_post, 'medium_large'),
            'register_url' => (string) get_post_meta($agenda_post->ID, 'register_url', true),
        ];
    }

    wp_reset_postdata();

    return $agenda_items;
}
