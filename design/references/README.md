# Исследование

- Mobbin MCP `search_screens`, запрос `marketplace product listing with filters`, web: сервер ответил `Mobbin MCP requires a paid plan`. Референсы недоступны; экраны Mobbin не использованы и не скопированы.
- Существующий каталог, фильтры, корзина, гараж и админ-панель изучены непосредственно в исходниках проекта.
- React: https://react.dev/reference/react/useState — состояние существующих форм и контролов.
- Tailwind CSS: https://tailwindcss.com/docs/theme — единые semantic theme variables для существующих Radix-компонентов.
- Manrope: https://github.com/google/fonts/tree/main/ofl/manrope — локальный variable font с кириллицей, OFL.

Context7 отсутствует среди доступных MCP-инструментов в этой сессии; использована официальная документация.
- Повторный запрос Mobbin после просьбы пользователя дал тот же ответ об ограничении платного плана.
- Сигнатуры дополнительных исправлений сверены с https://tanstack.com/query/v5/docs/framework/react/reference/useMutation, https://vite.dev/config/ и типами установленного @stripe/connect-js.

## Референсы для редизайна от 5 ноября 2026

- RockAuto — отдельный акцент на поиске по номеру детали и ключевым словам. [Help with finding parts](https://www.rockauto.com/help/?page=1)
- eBay Motors — сохранённые автомобили доступны отдельным действием. В AutoSpare переход открывает данные гаража для ручной сверки. [Buying parts and accessories](https://www.ebay.com/help/buying/buy-now/buying-ebay-motors?id=4639)
- Mobbin MCP в этой сессии вернул HTTP 401, локальный CLI показал статус `Not logged in`.
- Изображение первого экрана создано встроенным ImageGen. [Файл иллюстрации](../../frontend/public/marketplace/brake-assembly.jpg)

Запрос к встроенному ImageGen для иллюстрации

> Use case: product-mockup. Hero artwork for an automotive parts marketplace. Produce a premium photorealistic studio product photograph, landscape 3:2. A single large machined steel vented car brake rotor with authentic concentric brushing, drilled holes and fine metal texture, paired with a substantial burnt-orange automotive brake caliper mounted over its right side. One isolated assembly at dynamic three-quarter view, nearly upright, rotor's silver face clearly readable and sculptural. Show the full assembly with breathing room. Center the subject horizontally and vertically. Cool silver rim lighting with restrained warm edge lighting and rich soft shadows on a matte, near-black charcoal #171816 seamless backdrop fading softly into black toward the edges. The image should feel like a real performance parts manufacturer's editorial studio photography. No lettering, labels, branding, text, watermark, technical diagrams, neon, or extra objects.
