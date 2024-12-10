import { Page } from '@playwright/test';

export class ApiRequests {
    private page:  Page;

    constructor(page: Page){
        this.page = page;
    }

    async getHtmlResponseAndNavigate(responseUrl: string, navigateUrl: string): Promise<any | null> {
        try {
            // Wait for the response from the specific URL
            const responsePromise = this.page.waitForResponse((response) =>
                response.url().includes(responseUrl)
            );

            // Trigger the network request
            await this.page.goto(navigateUrl);

            // Wait for the response
            const response = await responsePromise;

            //Decided to use a warn here instead of interrupting execution for test fails if something doesn't return 200. 
            if (response.status() !== 200) {
                console.warn(
                    `Warning: Expected status 200 but received ${response.status()} for URL: ${response.url()}`
                );
                return null; 
            }

            //Added content type validation
            const contentType = response.headers()['content-type'] || '';
            if (!contentType.includes('text/html')){
                console.error(
                    `Error: Expected 'text/html' content type but received '${contentType}' for URL: ${response.url()}`
                );
                return null;
            }

            return await response.text();
        } catch (error) {
            console.error(
                `Error while fetching response for URL: ${responseUrl}. Error: ${error.message}`
            );
            return null; // Return null on errors
        }
    }
}