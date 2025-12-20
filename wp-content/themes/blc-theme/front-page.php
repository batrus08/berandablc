<?php
/**
 * Front page template for BLC main site.
 */

get_header();

$home_settings = function_exists('blc_home_settings') ? blc_home_settings() : [];
$latest_news   = function_exists('blc_get_latest_news_posts') ? blc_get_latest_news_posts($home_settings['news_blog_id'] ?? null) : [];
$highlights    = isset($home_settings['highlights']) && is_array($home_settings['highlights']) ? $home_settings['highlights'] : [];
$quick_access  = isset($home_settings['quick_access']) && is_array($home_settings['quick_access']) ? $home_settings['quick_access'] : [];
$events        = isset($home_settings['events']) && is_array($home_settings['events']) ? $home_settings['events'] : [];
?>

<main class="blc-home" id="main-content">
    <section class="hero" aria-labelledby="hero-title">
        <div class="hero__background" aria-hidden="true"></div>
        <div class="container hero__content">
            <div class="hero__text">
                <?php if (!empty($home_settings['hero_eyebrow'])) : ?>
                    <p class="eyebrow"><?php echo esc_html($home_settings['hero_eyebrow']); ?></p>
                <?php endif; ?>
                <?php if (!empty($home_settings['hero_title'])) : ?>
                    <h1 id="hero-title"><?php echo esc_html($home_settings['hero_title']); ?></h1>
                <?php endif; ?>
                <?php if (!empty($home_settings['hero_lead'])) : ?>
                    <p class="lead"><?php echo wp_kses_post($home_settings['hero_lead']); ?></p>
                <?php endif; ?>
                <div class="hero__actions">
                    <?php if (!empty($home_settings['hero_primary_label']) && !empty($home_settings['hero_primary_url'])) : ?>
                        <a class="btn btn--accent" href="<?php echo esc_url($home_settings['hero_primary_url']); ?>" aria-label="<?php echo esc_attr($home_settings['hero_primary_label']); ?>">
                            <?php echo esc_html($home_settings['hero_primary_label']); ?>
                        </a>
                    <?php endif; ?>
                    <?php if (!empty($home_settings['hero_secondary_label']) && !empty($home_settings['hero_secondary_url'])) : ?>
                        <a class="btn btn--outline" href="<?php echo esc_url($home_settings['hero_secondary_url']); ?>" aria-label="<?php echo esc_attr($home_settings['hero_secondary_label']); ?>">
                            <?php echo esc_html($home_settings['hero_secondary_label']); ?>
                        </a>
                    <?php endif; ?>
                </div>
            </div>
            <div class="hero__highlights">
                <?php if (!empty($highlights)) : ?>
                    <?php foreach ($highlights as $highlight) : ?>
                        <div class="highlight-card">
                            <?php if (!empty($highlight['label'])) : ?>
                                <span class="highlight-label"><?php echo esc_html($highlight['label']); ?></span>
                            <?php endif; ?>
                            <?php if (!empty($highlight['text'])) : ?>
                                <p><?php echo esc_html($highlight['text']); ?></p>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                <?php else : ?>
                    <p class="news-empty">Belum ada highlight diatur.</p>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <section class="quick-access" aria-labelledby="quick-access-title">
        <div class="container">
            <div class="section-header">
                <div>
                    <p class="eyebrow">Akses Cepat</p>
                    <h2 id="quick-access-title">Temukan Insight Sesuai Kebutuhan</h2>
                </div>
            </div>
            <div class="quick-access__grid">
                <?php if (!empty($quick_access)) : ?>
                    <?php foreach ($quick_access as $item) : ?>
                        <a class="access-card" href="<?php echo esc_url($item['url']); ?>">
                            <h3><?php echo esc_html($item['title']); ?></h3>
                            <?php if (!empty($item['description'])) : ?>
                                <p><?php echo esc_html($item['description']); ?></p>
                            <?php endif; ?>
                        </a>
                    <?php endforeach; ?>
                <?php else : ?>
                    <p class="news-empty">Belum ada tautan akses cepat.</p>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <section class="about-impact" aria-labelledby="about-title">
        <div class="container about-impact__grid">
            <div class="about-impact__text">
                <p class="eyebrow">Tentang BLC</p>
                <h2 id="about-title">Mendorong literasi hukum bisnis yang relevan</h2>
                <p>Business Law Community (BLC) menjadi ruang kolaborasi untuk mengakselerasi pemahaman hukum bisnis melalui riset, publikasi, dan pengabdian. Kami percaya karya ilmiah yang aplikatif mampu menjawab tantangan industri.</p>
                <div class="about-impact__cta">
                    <a class="btn btn--ghost" href="/tentang-kami/">Pelajari Tentang Kami</a>
                </div>
            </div>
            <div class="about-impact__stats" aria-label="Statistik singkat BLC">
                <div class="stat-card">
                    <p class="stat-number">120+</p>
                    <p class="stat-label">Publikasi</p>
                </div>
                <div class="stat-card">
                    <p class="stat-number">45</p>
                    <p class="stat-label">Kegiatan</p>
                </div>
                <div class="stat-card">
                    <p class="stat-number">30</p>
                    <p class="stat-label">Mitra</p>
                </div>
            </div>
        </div>
    </section>

    <section class="latest-news" aria-labelledby="latest-news-title">
        <div class="container">
            <div class="section-header">
                <div>
                    <p class="eyebrow">Publikasi Terbaru</p>
                    <h2 id="latest-news-title">Sorotan Terkini dari BLC</h2>
                    <p class="section-subtitle">Terkurasi dari subsite news, menyajikan gagasan segar dan analisis hukum bisnis.</p>
                </div>
                <a class="btn btn--ghost" href="https://news.meoww.my.id/">Lihat Semua Publikasi</a>
            </div>
            <div class="news-grid">
                <?php if (!empty($latest_news)) : ?>
                    <?php foreach ($latest_news as $post_item) : ?>
                        <article class="news-card" tabindex="0" data-link="<?php echo esc_url($post_item['permalink']); ?>">
                            <div class="news-card__badge"><?php echo esc_html($post_item['category']); ?></div>
                            <?php if (!empty($post_item['thumbnail'])) : ?>
                                <div class="news-card__thumb-wrapper">
                                    <img class="news-card__thumb" src="<?php echo esc_url($post_item['thumbnail']); ?>" alt="" loading="lazy" />
                                </div>
                            <?php else : ?>
                                <div class="news-card__thumb-placeholder" aria-hidden="true"></div>
                            <?php endif; ?>
                            <div class="news-card__body">
                                <h3 class="news-card__title">
                                    <a href="<?php echo esc_url($post_item['permalink']); ?>"><?php echo esc_html($post_item['title']); ?></a>
                                </h3>
                                <div class="news-card__meta">
                                    <span><?php echo esc_html($post_item['date']); ?></span>
                                    <?php if (!empty($post_item['author'])) : ?>
                                        <span aria-label="Penulis">• <?php echo esc_html($post_item['author']); ?></span>
                                    <?php endif; ?>
                                </div>
                                <p class="news-card__excerpt"><?php echo esc_html($post_item['excerpt']); ?></p>
                                <a class="news-card__cta" href="<?php echo esc_url($post_item['permalink']); ?>" aria-label="Baca publikasi <?php echo esc_attr($post_item['title']); ?>">Baca Selengkapnya</a>
                            </div>
                        </article>
                    <?php endforeach; ?>
                <?php else : ?>
                    <p class="news-empty">Belum ada publikasi terbaru.</p>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <section class="events" aria-labelledby="events-title">
        <div class="container">
            <div class="section-header">
                <div>
                    <p class="eyebrow">Kegiatan Mendatang</p>
                    <h2 id="events-title">Kolaborasi &amp; Agenda BLC</h2>
                    <p class="section-subtitle">Pantau seminar, diskusi panel, dan lokakarya terbaru.</p>
                </div>
                <a class="btn btn--ghost" href="/kegiatan/">Lihat Semua Kegiatan</a>
            </div>
            <ul class="events__list">
                <?php if (!empty($events)) : ?>
                    <?php foreach ($events as $event) : ?>
                        <li class="event-item">
                            <div class="event-date">
                                <?php if (!empty($event['day'])) : ?>
                                    <span class="event-day"><?php echo esc_html($event['day']); ?></span>
                                <?php endif; ?>
                                <?php if (!empty($event['month'])) : ?>
                                    <span class="event-month"><?php echo esc_html($event['month']); ?></span>
                                <?php endif; ?>
                            </div>
                            <div class="event-info">
                                <?php if (!empty($event['title'])) : ?>
                                    <h3><?php echo esc_html($event['title']); ?></h3>
                                <?php endif; ?>
                                <?php if (!empty($event['text'])) : ?>
                                    <p><?php echo esc_html($event['text']); ?></p>
                                <?php endif; ?>
                            </div>
                        </li>
                    <?php endforeach; ?>
                <?php else : ?>
                    <li class="event-item"><p class="news-empty">Belum ada agenda ditampilkan.</p></li>
                <?php endif; ?>
            </ul>
        </div>
    </section>

    <section class="cta-band" aria-labelledby="cta-band-title">
        <div class="container cta-band__content">
            <div>
                <?php if (!empty($home_settings['cta_eyebrow'])) : ?>
                    <p class="eyebrow"><?php echo esc_html($home_settings['cta_eyebrow']); ?></p>
                <?php endif; ?>
                <?php if (!empty($home_settings['cta_title'])) : ?>
                    <h2 id="cta-band-title"><?php echo esc_html($home_settings['cta_title']); ?></h2>
                <?php endif; ?>
                <?php if (!empty($home_settings['cta_body'])) : ?>
                    <p><?php echo wp_kses_post($home_settings['cta_body']); ?></p>
                <?php endif; ?>
            </div>
            <div class="cta-band__actions">
                <?php if (!empty($home_settings['cta_primary_label']) && !empty($home_settings['cta_primary_url'])) : ?>
                    <a class="btn btn--accent" href="<?php echo esc_url($home_settings['cta_primary_url']); ?>" aria-label="<?php echo esc_attr($home_settings['cta_primary_label']); ?>">
                        <?php echo esc_html($home_settings['cta_primary_label']); ?>
                    </a>
                <?php endif; ?>
                <?php if (!empty($home_settings['cta_secondary_label']) && !empty($home_settings['cta_secondary_url'])) : ?>
                    <a class="btn btn--outline btn--light" href="<?php echo esc_url($home_settings['cta_secondary_url']); ?>">
                        <?php echo esc_html($home_settings['cta_secondary_label']); ?>
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>
