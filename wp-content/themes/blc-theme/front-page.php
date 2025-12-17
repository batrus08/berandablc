<?php
/**
 * Front page template for BLC main site.
 */

get_header();

$latest_news = function_exists('blc_get_latest_news_posts') ? blc_get_latest_news_posts() : [];
?>

<main class="blc-home" id="main-content">
    <section class="hero" aria-labelledby="hero-title">
        <div class="hero__background" aria-hidden="true"></div>
        <div class="container hero__content">
            <div class="hero__text">
                <p class="eyebrow">Kampus Fakultas Hukum</p>
                <h1 id="hero-title">Business Law Community Fakultas Hukum</h1>
                <p class="lead">Kolaborasi akademisi dan praktisi dalam kajian hukum bisnis, publikasi berkualitas, serta advokasi kebijakan.</p>
                <div class="hero__actions">
                    <a class="btn btn--accent" href="https://news.meoww.my.id/" aria-label="Baca publikasi terbaru di news.meoww.my.id">Baca Publikasi Terbaru</a>
                    <a class="btn btn--outline" href="/kerja-sama/" aria-label="Hubungi kami untuk kerja sama">Kerja Sama</a>
                </div>
            </div>
            <div class="hero__highlights">
                <div class="highlight-card">
                    <span class="highlight-label">Fokus</span>
                    <p>Regulasi bisnis, digital economy, dan governance korporasi.</p>
                </div>
                <div class="highlight-card">
                    <span class="highlight-label">Kolaborasi</span>
                    <p>Menghubungkan riset kampus dengan kebutuhan industri.</p>
                </div>
                <div class="highlight-card">
                    <span class="highlight-label">Insight</span>
                    <p>Publikasi rutin dari dosen, mahasiswa, dan mitra profesional.</p>
                </div>
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
                <a class="access-card" href="/publikasi-bulanan/">
                    <h3>Publikasi Bulanan</h3>
                    <p>Ringkasan isu hukum bisnis terkini setiap bulan.</p>
                </a>
                <a class="access-card" href="/opini-esai/">
                    <h3>Opini &amp; Esai</h3>
                    <p>Pandangan kritis dosen dan mahasiswa tentang dinamika regulasi.</p>
                </a>
                <a class="access-card" href="/kajian-hukum/">
                    <h3>Kajian Hukum</h3>
                    <p>Analisis mendalam regulasi, studi kasus, dan implikasi bisnis.</p>
                </a>
                <a class="access-card" href="/dokumen/">
                    <h3>Dokumen PDF</h3>
                    <p>Whitepaper, policy brief, dan materi seminar siap unduh.</p>
                </a>
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
                <li class="event-item">
                    <div class="event-date">
                        <span class="event-day">12</span>
                        <span class="event-month">Mei</span>
                    </div>
                    <div class="event-info">
                        <h3>Webinar: Kepatuhan Regulasi Startup</h3>
                        <p>Diskusi praktis bersama praktisi hukum teknologi.</p>
                    </div>
                </li>
                <li class="event-item">
                    <div class="event-date">
                        <span class="event-day">25</span>
                        <span class="event-month">Mei</span>
                    </div>
                    <div class="event-info">
                        <h3>Lokakarya: Drafting Kontrak Bisnis</h3>
                        <p>Pelatihan intensif untuk mahasiswa dan profesional muda.</p>
                    </div>
                </li>
                <li class="event-item">
                    <div class="event-date">
                        <span class="event-day">8</span>
                        <span class="event-month">Jun</span>
                    </div>
                    <div class="event-info">
                        <h3>Roundtable: ESG &amp; Tata Kelola</h3>
                        <p>Berbagi perspektif lintas sektor untuk praktik keberlanjutan.</p>
                    </div>
                </li>
            </ul>
        </div>
    </section>

    <section class="cta-band" aria-labelledby="cta-band-title">
        <div class="container cta-band__content">
            <div>
                <p class="eyebrow">Kolaborasi Strategis</p>
                <h2 id="cta-band-title">Mari wujudkan inisiatif hukum bisnis yang berdampak</h2>
                <p>Terbuka untuk riset bersama, penyusunan policy brief, maupun pelatihan korporasi.</p>
            </div>
            <div class="cta-band__actions">
                <a class="btn btn--accent" href="/kerja-sama/" aria-label="Ajukan kerja sama dengan BLC">Ajukan Kerja Sama</a>
                <a class="btn btn--outline btn--light" href="/kontak/">Hubungi Kami</a>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>
