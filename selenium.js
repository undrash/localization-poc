
const { Builder, By, Key, until, Capabilities } = require('selenium-webdriver');





(async function example() {
    const capabilities = Capabilities.chrome();

    capabilities.set( 'chromeOptions',{

        'args': ['--headless', '--no-sandbox', 'window-size=1024,768' , '--disable-gpu', "--remote-debugging-port=4300"]

    });


    let driver = await new Builder().forBrowser( 'chrome' ).withCapabilities( capabilities ).build();

    try {
        await driver.get('https://translate.google.com/?hl=en&tab=TT');

        await driver.wait( until.titleIs( 'Google Translate' ), 2000 );

        await driver.wait( until.elementLocated( By.id( 'source' ) ), 2000 );

        const element = await driver.findElement( By.id( "source" ) );

        await element.sendKeys( "hello world", Key.RETURN );

        await driver.wait( until.elementLocated( By.className( "tl-more" ) ), 2000 );

        const openLanguagesBtn = await driver.findElement( By.className( "tl-more" ) );

        await openLanguagesBtn.click();

        await driver.wait( until.elementLocated( By.xpath( '//div[contains(@class, "language-list-unfiltered-langs-tl_list")]//div[contains(@class, "language_list_item_wrapper-hu")]' ) ), 3000 );

        const hungarianLangBtn = await driver.findElement( By.xpath( '//div[contains(@class, "language-list-unfiltered-langs-tl_list")]//div[contains(@class, "language_list_item_wrapper-hu")]' ) );

        await hungarianLangBtn.click();

        await driver.wait( until.elementLocated( By.className( "translation" ) ), 2000 );

        const res = await driver.findElement( By.className( "translation" ) );

        const text = await res.getText();

        console.log( text );


    } finally {
        await driver.quit();
    }
})();

