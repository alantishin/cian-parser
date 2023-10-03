# rent an apartment faster

Parses ads for housing for rent and sends them through the Telegram bot. To be the first caller.
Parses only one page specified in env. You should set desceding created at order.

## environment
- TIME_STEP Interval between requests in seconds, default = 30
- TELEGRAM_BOT_TOKEN Create your own bot https://core.telegram.org/bots
- TELEGRAM_USER_IDS Users ids separated by comma. Get your id https://api.telegram.org/bot!!!BOT_TOKEN!!!/getUpdates
- CIAN_LINK link to site page, default = https://www.cian.ru/snyat-kvartiru-1-komn-ili-2-komn/ 