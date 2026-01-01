from playwright.sync_api import sync_playwright

def verify_ckan_import():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            # Navigate to CKAN Import page
            page.goto('http://localhost:5173/ckan-import')

            # Wait for page load
            page.wait_for_selector('text=Import from CKAN')

            # Type search query
            page.fill('input[placeholder="e.g. health, population"]', 'health')

            # Click Search
            page.click('text=Search')

            # Wait for results (mocked or real if accessible, but we might see 'No results' or error if external API is blocked)
            # Since we can't easily mock fetch in python playwright for the browser running in dev server without intercepting routes,
            # we will just take a screenshot of the UI state.
            # Ideally we would intercept network requests but for visual check this is fine.

            page.wait_for_timeout(2000) # Wait a bit for potential API response or timeout

            page.screenshot(path='verification/ckan_import.png')
            print("Screenshot taken")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path='verification/error.png')
        finally:
            browser.close()

if __name__ == '__main__':
    verify_ckan_import()
