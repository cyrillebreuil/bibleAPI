BEGIN;

INSERT INTO translations (code, name, language, languageCode, regionCode) VALUES
('clementine', 'Clementine Latin Vulgate', 'Latin', 'lat', 'VA')
ON CONFLICT (code) DO NOTHING;


INSERT INTO testamentTranslations (isNewTestament, translationID, name) VALUES
(FALSE, (SELECT id FROM translations WHERE code = 'clementine'), 'Vetus Testamentum'),
(TRUE, (SELECT id FROM translations WHERE code = 'clementine'), 'Novum Testamentum')
ON CONFLICT (isNewTestament, translationID) DO NOTHING;

