import { Page } from '@playwright/test';

export class ApiRequests {
    private page:  Page;

    constructor(page: Page){
        this.page = page;
    }

    async getResponseAndNavigate(responseUrl: string, navigateUrl: string): Promise<any | null> {
        try {
            // Wait for the response from the specific URL
            const responsePromise = this.page.waitForResponse((response) =>
                response.url().includes(responseUrl)
            );

            // Trigger the network request
            await this.page.goto(navigateUrl);

            // Wait for the response
            const response = await responsePromise;

            //Decided to use a warn here instead of interrupting execution for test fails if something doesn't return 200 because saucedemo was a bit flaky on their site. 
            if (response.status() !== 200) {
                console.warn(
                    `Warning: Expected status 200 but received ${response.status()} for URL: ${response.url()}`
                );
                return null; 
            }

            return await response.json();
        } catch (error) {
            console.error(
                `Error while fetching response for URL: ${responseUrl}. Error: ${error.message}`
            );
            return null; // Return null on errors
        }
    }
}