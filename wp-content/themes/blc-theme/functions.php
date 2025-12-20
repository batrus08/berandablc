<?php
/**
 * Theme functions for BLC front page.
 */

// Ganti sesuai blog_id subsite news jika berbeda.
if (!defined('BLC_NEWS_BLOG_ID')) {
    define('BLC_NEWS_BLOG_ID', 2);
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
function blc_get_latest_news_posts($blog_id = BLC_NEWS_BLOG_ID, $limit = 6) {
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
