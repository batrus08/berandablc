from playwright.sync_api import sync_playwright

def verify_articles_and_archive():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # 1. Verify articles list works (main articles page)
        print("Visiting articles.html...")
        page.goto("http://localhost:8080/src/pages/articles.html")
        page.wait_for_selector("#article-root .article-card")
        # Check if we have articles
        articles = page.query_selector_all("#article-root .article-card")
        print(f"Found {len(articles)} articles on articles.html")
        page.screenshot(path="verification/articles_list.png")

        # 2. Verify archive page (should not have list, only archive)
        print("Visiting artikel-arsip.html...")
        page.goto("http://localhost:8080/src/pages/artikel-arsip.html")
        # Wait for archive list
        page.wait_for_selector("#archive-list .card")

        # Check if article list is hidden/not rendered
        article_list_cards = page.query_selector_all("#article-list .article-card")
        print(f"Found {len(article_list_cards)} article cards on artikel-arsip.html (expected 0)")

        # Check if filter card is present
        filter_card = page.query_selector(".filter-card")
        if filter_card:
            print("Filter card found on archive page (unexpected if we hid renderList)")
        else:
            print("Filter card not found on archive page (correct)")

        page.screenshot(path="verification/archive_page.png")

        # 3. Verify detail page
        print("Visiting detail page...")
        page.goto("http://localhost:8080/src/pages/articles.html?slug=kebijakan-esg-dan-kontrak-bisnis")
        page.wait_for_selector("article.card h1")
        title = page.inner_text("article.card h1")
        print(f"Detail page title: {title}")
        page.screenshot(path="verification/article_detail.png")

        browser.close()

if __name__ == "__main__":
    verify_articles_and_archive()
