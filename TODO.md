maybe i should use id in books ?
need correction syndoal psalms

### Recherche et filtrage
- **Recherche textuelle** : Permettre aux utilisateurs de rechercher des termes spécifiques à travers toutes les traductions ou une traduction spécifique
  ```
  GET /search?q=amour&translation=kjv
  ```
- **Filtrage par thème** : Ajouter un système de tags/thèmes pour les versets (peut nécessiter une nouvelle table)
  ```
  GET /kjv/themes/amour
  ```
- **Autocomplete** : Pour aider les utilisateurs qui ne connaissent pas toutes les références bibliques
  ```
  GET /autocomplete?q=jean
  ```

### Endpoints additionnels
- **Commentaires bibliques** : Ajouter des commentaires et notes pour les versets
- **Comparaison de traductions** : Endpoint pour comparer le même verset dans différentes traductions
  ```
  GET /compare/GEN/1/1?translations=kjv,lsg,bds
  ```
- **Versets par jour** : Un endpoint qui renvoie un verset du jour, potentiellement lié au calendrier liturgique ou thématique
  ```
  GET /verse-of-the-day
  ```
- **Plans de lecture** : Créer des plans de lecture (plans quotidiens, lecture de la Bible en un an)
  ```
  GET /reading-plans
  GET /reading-plans/1/day/5
  ```

### Amélioration des données existantes
- **Métadonnées enrichies** : Ajouter des informations contextuelles (historique, arrière-plan culturel) pour les livres et chapitres
- **Versets similaires/références croisées** : Lier des versets qui parlent de sujets similaires
- **Étude des mots** : Lier à des informations sur les mots originaux (hébreu/grec) et leurs significations
