# پیش‌نویس محصول: کاربرگ تخصصی ثبت عیب‌یابی ECU و برق خودرو

**وضعیت:** `researched-not-submitted` — نمونهٔ اولیه ساخته شده؛ هنوز فروشنده/درگاه/مشتری تأیید نشده است.

## خریدار و مسئله
- خریدار اولیه: تعمیرگاه‌های مستقل ECU، برق‌کارهای خودرو و تکنسین‌های عیب‌یابی.
- مسئله: فرم عمومی پذیرش تعمیرگاه، شناسه‌های ECU، DTC و Freeze Frame، اندازه‌گیری‌های روی میز، شناسهٔ نرم‌افزار/سخت‌افزار و آزمون پس از تعمیر را به‌صورت منظم ثبت نمی‌کند.
- پیشنهاد: یک بستهٔ فارسی، چاپی و قابل‌تکمیل برای ثبت پروندهٔ ECU؛ بدون نیاز به نصب نرم‌افزار یا ارسال داده به سرور.

## دارایی ساخته‌شده
- نمونهٔ دوصفحه‌ای: [کاربرگ HTML فارسی](./diagnostic-record-fa.html)
- فایل مستقل است؛ اسکریپت خارجی، analytics، فرم ارسال، API، ذخیره‌سازی ابری یا جمع‌آوری داده ندارد.
- کاربر می‌تواند در مرورگر تکمیل و با Print به PDF تبدیل کند.
- فرم صرفاً ابزار ثبت سوابق است؛ مقادیر مرجع و روش آزمون باید از مستندات OEM و تکنسین واجدصلاحیت بیاید.

## فرضیهٔ قیمت و تحویل
- قیمت آزمایشی: **۹۹٬۰۰۰ تا ۱۴۹٬۰۰۰ تومان**؛ فرضیه است، نه قیمت بازار تأییدشده.
- نسخهٔ پایه: HTML قابل‌چاپ + PDF؛ نسخهٔ بعدی فقط در صورت تقاضای واقعی: فایل Excel/ODS برای فهرست پرونده‌ها و گزارش ماهانه.
- تحویل مطلوب: دانلود خودکار بلافاصله پس از پرداخت در یک marketplace که پذیرنده و تسویهٔ ریالی را قانوناً تأیید کند.
- با کمیسیون ۱۰٪، دریافتی فرضی از قیمت ۹۹٬۰۰۰ تومان حدود ۸۹٬۱۰۰ تومان پیش از مالیات/هزینهٔ برداشت است؛ این محاسبه فقط در صورت تأیید همان نرخ کمیسیون معتبر خواهد بود.

## شواهد بازار و محدودیت رقابتی
1. [Etsy — Auto Repair Shop Management System Excel](https://www.etsy.com/listing/4473714873/auto-repair-shop-management-system-excel): فهرست ۱۴-sheet با قیمت مشاهده‌شدهٔ ۱۱٫۲۴ دلار و نمایش ۶ بازدید در ۲۴ ساعت؛ بازدید، فروش نیست.
2. [Etsy — Mechanic Invoice + Work Order Tracker](https://www.etsy.com/listing/4349263377/bundle-mechanic-invoice-template-work): نمونهٔ bundle با فایل فوری Google Sheets/Excel/PDF؛ در زمان بررسی صفحه ۷ علاقه‌مندی نشان می‌داد. قیمت/علاقه‌مندی‌ها فروش قطعی را ثابت نمی‌کنند.
3. [EcusRepairs](https://www.ecusrepairs.com/): فروش فایل‌های تخصصی ECU و pin-data با قیمت‌های فهرست‌شده حدود ۱۴ تا ۳۹ دلار؛ این محصولات آموزشی/فنی‌اند، نه رقیب مستقیم فرم.
4. [JobCardOS](https://jobcardos.com/job-card-template): فرم عمومی job-card رایگان و بدون ثبت‌نام؛ [Mitti](https://mitti.com/library/transport-and-logistics/job-card) نیز یک فرم عمومی با ۷۰+ دانلود نمایش می‌دهد.
5. نتیجهٔ Skeptic: فرم عمومی قابل‌فروش نیست؛ تمایز باید در ثبت ECU part/HW/SW ID، DTC/Freeze Frame، تست روی میز، اقدام تعمیراتی و تأیید پس از تعمیر باشد. هنوز buyer intent مستقیم برای نسخهٔ فارسی اثبات نشده است.

## کانال و پرداخت ایران
- [Sibilapp — صفحهٔ فروشنده](https://sibilapp.ir/sell): نتیجهٔ جست‌وجوی فعلی آن را با کمیسیون ۱۰٪، بدون هزینهٔ راه‌اندازی و تحویل خودکار فایل معرفی می‌کند؛ اما صفحه در این اجرا از طریق مرورگر ابزار باز نشد. KYC، روش/زمان تسویه و شرایط دقیق پذیرش فروشنده هنوز از منبع رسمی قابل‌خواندن تأیید نشده‌اند.
- وضعیت کانال: `blocked` تا زمان ایجاد حساب فروشنده، تأیید پذیرش و مشاهدهٔ رسمی روش تسویه؛ هیچ فرم یا حسابی ارسال/ایجاد نشده است.
- [زرین‌پال — درگاه پرداخت](https://www.zarinpal.com/payment-gateway): صفحهٔ رسمی از احراز هویت و ثبت درخواست درگاه می‌گوید؛ ماه اول عضویت را بدون کارمزد زرین‌پال (با کسر کارمزد شاپرکی) معرفی می‌کند، کارمزد استاندارد را ۰٫۵٪ تا سقف ۱۶٬۰۰۰ تومان و تسویه را یک روز پس از تراکنش تا ساعت ۱۷ اعلام می‌کند. واجدشرایط‌بودن این مالک/کسب‌وکار تأیید نشده است.
- [زرین‌پال — مستندات اتصال](https://www.zarinpal.com/docs/paymentGateway/connectToGateway): درخواست، انتقال به صفحهٔ پرداخت و verify را مستند کرده است.
- [زیبال — راهنمای ثبت‌نام](https://help.zibal.ir/article/registration/): صفحهٔ رسمی (آخرین ویرایش ۱۷ اکتبر ۲۰۲۶) مدارک هویتی و شبا به نام متقاضی/شرکت را در روند پذیرندگی مطرح می‌کند؛ جزئیات کامل fee/settlement در این بررسی تأیید نشد.
- [PayPing API](https://docs.payping.ir/): مستندات رسمی پرداخت، verify، refund، گزارش و درخواست تسویه را دارد؛ نرخ کارمزد و واجدشرایط‌بودن پذیرنده در این اجرا تأیید نشد.
- IDPay: صفحه/مستندات رسمی در این اجرا قابل‌دسترسی و تأیید نبود؛ تا دریافت منبع رسمی، گزینهٔ قابل‌استفاده محسوب نمی‌شود.
- [OFAC Iran Sanctions](https://ofac.treasury.gov/sanctions-programs-and-country-information/iran-sanctions): صفحهٔ رسمی شامل هشدارهای به‌روزشده تا ۴ نوامبر ۲۰۲۶ و تغییرات مجوزهاست. اگر مالک/کسب‌وکار U.S. person یا دارای nexus آمریکا باشد، پیش از هر تراکنش/ثبت‌نام مرتبط با ایران باید مجازبودن فعالیت و طرف‌های معامله توسط مشاور حقوقی صلاحیت‌دار بررسی شود. هیچ مسیر دورزدن تحریم یا واسطه‌سازی پیشنهاد نمی‌شود.

## امتیاز تصمیم (۰ تا ۵)
| معیار | امتیاز | مبنا |
|---|---:|---|
| شواهد خریدار | 2 | بازار template وجود دارد؛ خرید مستقیم برای نسخهٔ فارسی اثبات نشده |
| سرعت اولین فروش | 2 | نیازمند پذیرش فروشنده و کانال توزیع |
| امکان شروع بدون هزینه | 4 | ساخت فایل و انتشار دیجیتال کم‌هزینه؛ کمیسیون از فروش |
| اتوماسیون | 4 | فایل قابل‌دانلود و تحویل خودکار، در صورت تأیید marketplace |
| بار پشتیبانی | 4 | محصول ثابت و بدون integration؛ پشتیبانی محدود |
| امکان قانونی/پلتفرمی | 2 | KYC، تسویه و وضعیت تحریمی مالک هنوز روشن نیست؛ تا رفع ابهام اجرا نمی‌شود |

## گام بعدی
1. قبل از ساخت نسخهٔ پولی، یک نمونهٔ رایگان از فرم را به‌عنوان preview قابل‌مشاهده منتشر و فقط از بازخورد opt-in تعمیرکاران استفاده کن.
2. پیش از listing، شرایط فروشنده، احراز هویت، کارمزد، تسویه، refund و کشور/اقامت مجاز را مستقیماً در پنل رسمی marketplace/gateway تأیید کن.
3. فقط پس از تأیید قانونی و پرداخت، فایل نهایی را با تحویل خودکار فهرست کن؛ هیچ شماره کارت، شبا، حساب یا مدرک هویتی در repository یا گزارش ثبت نشود.

**تصمیم Desk Lead:** فرصت مستقل قابل‌ساخت است، اما فعلاً Golden River نیست. به‌دلیل نبود buyer intent مستقیم و ابهام در پذیرش/تسویه، در وضعیت `researched-not-submitted` می‌ماند.

**Freshness caveat (2026-11-05):** the Sibilapp seller page content is available in a search-indexed result crawled about two months ago; a live fetch failed with a tunnel error. Treat the advertised 10% commission, no setup fee and instant delivery as preliminary until the official seller dashboard/terms are opened and verified. No seller account, KYC or listing was created.


## Source freshness caveat — 2026-11-05
The Sibilapp seller page content is available only in a search-indexed result crawled about two months ago; a live fetch failed with a tunnel error. Treat the advertised 10% commission, no setup fee and instant delivery as preliminary until the official seller dashboard/terms are opened and verified. No seller account, KYC or listing was created.


## Evidence refresh — 2026-11-06

### Market signal and competition
- Etsy's current auto-repair order-form category shows **134+ items**. Digital examples appear around **$1.26–$9.50**, with several listings showing substantial engagement counts. These are marketplace signals, not verified sales for this Persian ECU-specific form. https://www.etsy.com/market/order_form_for_auto_repair
- One current auto-shop management spreadsheet is listed at **$34.99** but shows **0 sales / no reviews** after about two months: a reminder that a high price is not proof of demand. https://www.etsy.com/listing/4574436728/auto-repair-shop-financial-spreadsheet
- Free substitutes are strong: Garageauto offers five free PDF/Word inspection forms, and Tekmetric offers a free 100-point checklist. Generic repair-order forms are therefore commoditized. https://garageauto.app/vehicle-inspection-checklist/ · https://www.tekmetric.com/post/the-comprehensive-vehicle-inspection-checklist-printable
- The only defensible differentiation is the specialist ECU workflow already in the sample: ECU part/HW/SW IDs, DTC/Freeze Frame, bench measurements, repair actions and post-repair verification. Direct demand for this exact Persian niche remains unproven.

### Persian distribution and checkout research
- **Digyno:** no sign-up/monthly fee, **3% per sale**, automatic digital-file delivery. New sellers have a **72-hour** review hold until five successful sales, then 24 hours; minimum withdrawal **100,000 toman**; withdrawal usually within one business day. Seller identity verification, a seller-owned payout account and manager approval are required. PDF/XLSX/ZIP/DOCX/CSV are accepted (100 MB per file, up to 10 files/product); scripts, executable files and macro-enabled workbooks are prohibited. https://digyno.com/sell
- **Zarinpal:** first month waives its provider fee but not Shaparak charges; standard fee **0.5% capped at 16,000 toman + 500 fixed**. The official IPG page says automatic next-day settlement by 17:00 and identity/document review before activation. https://www.zarinpal.com/pricing · https://www.zarinpal.com/payment-gateway
- **Zibal:** **1% capped at 20,000 toman**, plus VAT on the fee; no setup/monthly fee; settlement follows the account cycle. Official prerequisites include applicant verification, a matching payout account, tax tracking, valid eNamad and a relevant license. https://zibal.ir/pricing · https://help.zibal.ir/article/registration/
- **PayPing:** base plan has no annual subscription and charges **1% capped at 5,000 toman + 500 fixed + VAT**; automatic daily settlement is listed. Product/invoice links, API, refunds and reporting are documented. Seller eligibility still needs confirmation in the official account. https://payping.ir/pricing · https://docs.payping.ir/
- **IDPay:** official API requires a dashboard API key and documents create/verify/status endpoints; its fee page returned HTTP 502, so current fees and settlement were not verified. https://idpay.ir/web-service/v1.1/ · https://blog.idpay.ir/helps/106
- Etsy Payments does not list Iran as eligible and requires the shop bank country to match; Payhip's free tier still relies on PayPal/Stripe, so neither is a verified Iran payout route. https://help.etsy.com/hc/en-us/articles/115015710408-Countries-Eligible-for-Etsy-Payments · https://payhip.com/pricing

### Legal gate and decision
- OFAC's Iran page currently includes a **4 November 2026** alert and lists an automotive-sector determination effective **1 October 2026**. The owner's legal person/residence and any U.S. nexus are not established here. Because this product targets automotive workshops, do not sell, onboard or route payments to Iranian buyers until qualified legal review confirms the specific activity and counterparties are permitted. https://ofac.treasury.gov/sanctions-programs-and-country-information/iran-sanctions
- Status remains **researched-not-submitted**. Updated scores (0–5): buyer evidence **3**; speed **2**; zero-upfront-cost **4**; automation **5**; low support **4**; legal/platform feasibility **0 pending review**. The zero legal score blocks execution under the Golden Desk gate.
- No seller/gateway account, listing, identity verification, payout setting or payment was created or changed. No personal or bank details were collected or stored.
- Next action: keep the product unpublished until legal eligibility is confirmed and any required seller verification is completed directly on the official provider site. No further feature work is justified until opt-in feedback from an ECU technician is observed.
