<?php
/**
 * Plugin Name: BLC Agenda CPT
 * Description: Custom post type Agenda dengan meta field untuk kebutuhan headless frontend.
 * Version: 1.0.0
 * Author: BLC
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', function () {
    $labels = [
        'name'               => 'Agenda',
        'singular_name'      => 'Agenda',
        'menu_name'          => 'Agenda',
        'name_admin_bar'     => 'Agenda',
        'add_new'            => 'Tambah Baru',
        'add_new_item'       => 'Tambah Agenda Baru',
        'new_item'           => 'Agenda Baru',
        'edit_item'          => 'Edit Agenda',
        'view_item'          => 'Lihat Agenda',
        'all_items'          => 'Semua Agenda',
        'search_items'       => 'Cari Agenda',
        'not_found'          => 'Agenda tidak ditemukan',
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
    ]);
});

add_action('init', function () {
    $meta_fields = [
        'start_date' => [
            'type' => 'string',
            'description' => 'Tanggal mulai agenda (YYYY-MM-DD)',
            'sanitize_callback' => 'sanitize_text_field',
        ],
        'end_date' => [
            'type' => 'string',
            'description' => 'Tanggal selesai agenda (YYYY-MM-DD)',
            'sanitize_callback' => 'sanitize_text_field',
        ],
        'time' => [
            'type' => 'string',
            'description' => 'Waktu penyelenggaraan',
            'sanitize_callback' => 'sanitize_text_field',
        ],
        'location' => [
            'type' => 'string',
            'description' => 'Lokasi agenda',
            'sanitize_callback' => 'sanitize_text_field',
        ],
        'register_url' => [
            'type' => 'string',
            'description' => 'URL pendaftaran',
            'sanitize_callback' => 'esc_url_raw',
        ],
    ];

    foreach ($meta_fields as $key => $args) {
        register_post_meta('agenda', $key, array_merge($args, [
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => '__return_true',
        ]));
    }
});
