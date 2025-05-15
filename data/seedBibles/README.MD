j'ai ajouté le livre d'abdias a la main, car sur le site d'aelf, chapitre O n'est pas correct; je l'ia passé en chapitre 1, chaque verset manuellement, donc autant copier le sql directement plutot dans ce cas, plutot que de createseed; il manquera toujours le livre

---
Code sépcifique du livre :


INSERT INTO "bookTranslations" ("bookID", "translationID", "name") VALUES
      ('OBA', (SELECT "id" FROM "translations" WHERE "code" = 'aelf'), 'Livre d''Abdias')
      ON CONFLICT ("bookID", "translationID") DO NOTHING;


        INSERT INTO "chapters" ("bookID", "number") VALUES
        ('OBA', 1)
        ON CONFLICT ("bookID", "number") DO NOTHING;

		        INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        1,
		        'VISION D’ABDIAS. Ainsi parle à Édom le Seigneur Dieu. Nous avons entendu, de la part du Seigneur, une nouvelle ; un messager a été envoyé parmi les nations : « Debout ! Dressons-nous ! Attaquons-le ! »')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        2,
		        'Voici : je t’abaisse parmi les nations, tu es très méprisé.')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        3,
		        'L’arrogance de ton cœur t’a trompé, toi qui demeures dans les creux du rocher, qui habites le haut-pays et dis en ton cœur : « Qui me fera descendre jusqu’à terre ? »')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        4,
		        'Si tu t’élevais comme l’aigle, si tu établissais ton nid au milieu des étoiles, je t’en ferais descendre ! – oracle du Seigneur.')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        5,
		        'Si des voleurs venaient chez toi, des pillards pendant la nuit, – comme tu serais anéanti ! –  ne voleraient-ils pas tout ce qu’ils peuvent ? Si des vendangeurs venaient chez toi, laisseraient-ils quelque chose à grappiller ?')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        6,
		        'Comme il a été fouillé, Ésaü, on a découvert ses cachettes !')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        7,
		        'Tous ceux qui étaient pour toi des alliés t’ont repoussé à la frontière ; ceux qui étaient en paix avec toi t’ont trompé, ils t’ont dominé. Et ceux qui partageaient ton pain ont mis un piège sous tes pas. – On n’en a pas l’intelligence ! –')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        8,
		        'N’est-ce pas en ce jour-là – oracle du Seigneur –, que je supprimerai d’Édom les sages, et de la montagne d’Ésaü, l’intelligence ?')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        9,
		        'Témane, tes guerriers seront paralysés, si bien que nul n’échappera au carnage sur la montagne d’Ésaü.')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        10,
		        'À cause de la violence faite à ton frère Jacob, la honte te couvrira et à jamais tu disparaîtras !')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        11,
		        'Le jour où tu n’es pas intervenu pour lui, lorsque des étrangers capturaient son armée, que des barbares franchissaient ses portes et tiraient au sort Jérusalem, toi aussi, tu étais comme l’un d’eux.')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        12,
		        'Ne regarde pas avec plaisir le jour de ton frère, le jour de son désastre. Ne te réjouis pas au sujet des fils de Juda, le jour de leur perdition. N’aie pas le verbe haut, le jour de la détresse.')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        13,
		        'Ne pénètre pas dans la ville de mon peuple, le jour de sa ruine. Ne regarde pas non plus son malheur, le jour de sa ruine. Ne t’en prends pas à son armée, le jour de sa ruine :')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        14,
		        'ne te tiens pas aux carrefours pour exterminer ses fuyards ; ne livre pas ses rescapés, le jour de la détresse.')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        15,
		        'Oui, proche est le jour du Seigneur, sur toutes les nations. On te fera comme tu as fait : tes méfaits te retomberont sur la tête.')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        16,
		        'Oui, de même que vous avez bu sur ma montagne sainte, toutes les nations boiront sans trêve : elles boivent, elles se gorgent, elles sont comme n’ayant pas été.')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        17,
		        'Mais il y aura un reste sur la montagne de Sion, il sera saint. La maison de Jacob héritera de son héritage.')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        18,
		        'La maison de Jacob sera un feu, la maison de Joseph, une flamme, et la maison d’Ésaü sera de la paille ! Elles vont la brûler et la dévorer : pas de survivant dans la maison d’Ésaü ! Oui, le Seigneur a parlé !')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        19,
		        'Le Néguev héritera de la montagne d’Ésaü, et le Bas-Pays, de la Philistie ; ils hériteront du territoire d’Éphraïm et du territoire de Samarie, et Benjamin héritera du Galaad.')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        20,
		        'Les déportés des fils d’Israël – cette armée-là ! – hériteront de Canaan, jusqu’à Sarepta, et les déportés de Jérusalem qui sont à Séfarad hériteront des villes du Néguev.')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;


				INSERT INTO "verses" ("chapterID", "translationID", "number", "text") VALUES
		        ((SELECT "id" FROM "chapters" WHERE "bookID" = 'OBA' AND "number" = 1),
		        (SELECT "id" FROM "translations" WHERE "code" = 'aelf'),
		        21,
		        'Les libérateurs monteront à la montagne de Sion pour juger la montagne d’Ésaü. Au Seigneur, la royauté !')
		        ON CONFLICT ("chapterID", "translationID", "number") DO NOTHING;
