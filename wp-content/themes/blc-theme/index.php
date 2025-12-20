<?php
/**
 * Fallback template to satisfy WordPress theme requirements.
 */

get_header();
?>
<main id="main-content" class="blc-home blc-fallback">
    <div class="container">
        <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                    <h1 class="entry-title"><?php the_title(); ?></h1>
                    <div class="entry-content">
                        <?php the_content(); ?>
                    </div>
                </article>
            <?php endwhile; ?>
        <?php else : ?>
            <p>Konten belum tersedia. Silakan buat halaman statis dan jadikan sebagai beranda untuk memicu template <code>front-page.php</code>.</p>
        <?php endif; ?>
    </div>
</main>
<?php get_footer(); ?>
