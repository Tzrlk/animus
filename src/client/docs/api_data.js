define({ "api": [
  {
    "type": "get",
    "url": "/api/auth",
    "title": "Checks that the authentication for the current user is valid.",
    "name": "GetUser",
    "group": "Authentication",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>The email of the user.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "user",
            "description": "<p>The user record currently in the session.</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/server/api/auth/auth-check.js",
    "groupTitle": "Authentication"
  }
] });