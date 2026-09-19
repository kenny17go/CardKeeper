# CardKeeper AI Batch Contract v1

Purpose: define a provider-neutral request/response format for AI batch business-card processing.

## Design goals
- No AI vendor lock-in.
- One photo may contain one or many business cards.
- AI must never write directly to IndexedDB.
- CardKeeper validates and shows results before saving.
- Low-confidence fields remain visible for manual confirmation.
- Existing-card comparison is handled by CardKeeper, not by the AI provider.

## Request shape

```json
{
  "schemaVersion": "1.0",
  "batchId": "client-generated-id",
  "sourceLabel": "2026 金融論壇",
  "images": [
    {
      "imageId": "p_001",
      "mimeType": "image/jpeg",
      "dataUrl": "data:image/jpeg;base64,..."
    }
  ],
  "options": {
    "languageHints": ["zh-Hant", "en"],
    "detectMultipleCards": true,
    "returnCrops": true,
    "returnFieldConfidence": true,
    "suggestCategory": true
  }
}
```

## Response shape

```json
{
  "schemaVersion": "1.0",
  "batchId": "same-as-request",
  "cards": [
    {
      "sourceImageId": "p_001",
      "sourceIndex": 0,
      "crop": {
        "x": 0.08,
        "y": 0.12,
        "width": 0.41,
        "height": 0.31,
        "rotation": 0
      },
      "cropImage": "data:image/jpeg;base64,...",
      "confidence": 94,
      "fields": {
        "name": "王小明",
        "nameEn": "Ming Wang",
        "company": "OO股份有限公司",
        "title": "經理",
        "mobile": "0912-345-678",
        "phone": "02-1234-5678",
        "phone2": "",
        "fax": "",
        "email": "ming@example.com",
        "website": "www.example.com",
        "address": "台北市...",
        "department": "企業金融部",
        "extension": "1688",
        "taxId": "12345678",
        "category": "金融",
        "note": ""
      },
      "fieldConfidence": {
        "name": 96,
        "company": 99,
        "title": 91,
        "mobile": 98,
        "email": 95
      },
      "rawText": "..."
    }
  ],
  "warnings": []
}
```

## Required validation rules
- `schemaVersion` must be `1.0`.
- `cards` must be a non-empty array.
- Each card must identify `sourceImageId` or `sourceIndex`.
- Crop coordinates, when present, are normalized 0..1.
- `confidence` and field confidence values are 0..100.
- Fields not recognized should be empty strings, never invented values.
- CardKeeper owns duplicate detection, update comparison, and final persistence.

## Provider responsibilities
1. Detect each card in every source image.
2. Deskew/rotate each card.
3. Extract text.
4. Map text to fields.
5. Return per-field confidence.
6. Suggest category only when reasonable.
7. Return warnings for ambiguous or unreadable content.

## CardKeeper responsibilities
1. Compress photos before upload.
2. Validate provider response.
3. Group cards by company.
4. Compare with existing local cards.
5. Highlight low-confidence or changed fields.
6. Require user confirmation.
7. Save only confirmed records.


## Duplicate/update persistence policy
When CardKeeper matches an AI result to an existing local card, the default action is **skip / keep existing data**. The user may explicitly choose:
- **skip**: keep the existing card unchanged.
- **merge**: fill only fields that are blank on the existing card; preserve existing non-empty values.
- **replace**: update the existing record with non-empty values from the new card while preserving its ID, creation date, favorite state, back image, and other unrelated stored data.

AI providers do not choose these actions. CardKeeper and the user own the decision.
