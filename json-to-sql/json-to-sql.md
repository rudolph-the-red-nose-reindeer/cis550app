# JSON to SQL converter

### Setup
* `cd json-to-sql`
*  `npm i`

### usage
`node converter.js path-to-input.json path-to-output.sql`

### Limitations

Parses below schema from json
>       [
>          "field(e.g reviewerID)": "reviewerIDExample"//this is a field from the schema defined in the original datset
>       ]

### Example

>input.json
```json
[
    {
        "overall": 5.0,
        "verified": true,
        "reviewTime": "08 22, 2013",
        "reviewerID": "A34A1UP40713F8",
        "asin": "B00009W3I4",
        "style": {
            "Style:": " Dryer Vent"
        },
        "reviewerName": "James. Backus",
        "reviewText": "I like this as a vent as well as something that will keep house warmer in winter.  I sanded it and then painted it the same color as the house.  Looks great.",
        "summary": "Great product",
        "unixReviewTime": 1377129600
    },
    {
        "overall": 5.0,
        "verified": true,
        "reviewTime": "02 8, 2016",
        "reviewerID": "A1AHW6I678O6F2",
        "asin": "B00009W3PA",
        "style": {
            "Size:": " 6-Foot"
        },
        "reviewerName": "kevin.",
        "reviewText": "good item",
        "summary": "Five Stars",
        "unixReviewTime": 1454889600
    }
]
```

>output.sql
```sql
INSERT INTO Review (reviewerID, asin, vote, reviewText, overall, summary, time, date) 
      VALUES ("A34A1UP40713F8", B00009W3I4, null, "I like this as a vent as well as something that will keep house warmer in winter.  I sanded it and then painted it the same color as the house.  Looks great.", 5, "Great product", 1377129600, "08 22, 2013");
INSERT INTO Review (reviewerID, asin, vote, reviewText, overall, summary, time, date) 
      VALUES ("A1AHW6I678O6F2", B00009W3PA, null, "good item", 5, "Five Stars", 1454889600, "02 8, 2016");
INSERT INTO Reviewer (reviewerID, reviewerName) VALUES ("A34A1UP40713F8", "James. Backus");
INSERT INTO Reviewer (reviewerID, reviewerName) VALUES ("A1AHW6I678O6F2", "kevin.");
```

### Update
Currently only creates INSERT statements for review/reviewer data.
