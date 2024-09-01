# Admin Sequence Diagram

## 1. Browsing

- Admin can browse articles without logging in.

```plantuml
@startuml
actor Admin
Admin -> Articles : Browse Articles
@enduml
```

## 2. Sign In

- Admin can sign in:
  - If sign-in fails:
    - Return to the sign-in step.
  - If sign-in succeeds:
    - Redirect to /blog.

```plantuml
@startuml
actor Admin
Admin -> nextAuth : Send credentials for authentication
alt Sign-in succeeds
    nextAuth --> Admin : Sign-in succeeds
    Admin -> Blog : Redirect to /blog
else Sign-in fails
    nextAuth --> Admin : Sign-in fails
    Admin -> SignIn : Return to sign-in
end
@enduml
```

## 3. Managing Articles

- In /admin/articles:
  - Create Article: axios.post('/api/articles')
    - If creation fails:
      - Stay on this step and return an error.
    - If creation succeeds:
      - Redirect to /blog and retrieve new data.

```plantuml
@startuml
actor Admin
Admin -> Articles : Create Article
alt Creation succeeds
    Articles --> Admin : Creation succeeds
    Admin -> Blog : Redirect to /blog
else Creation fails
    Articles --> Admin : Creation fails
end
@enduml
```

- Update Article: axios.put('/api/articles/:id')
  - If update fails:
    - Stay on this step and return an error.
  - If update succeeds:
    - Redirect to /blog/:id and retrieve new data.

```plantuml
@startuml
actor Admin
Admin -> Articles : Update Article
alt Update succeeds
    Articles --> Admin : Update succeeds
    Admin -> Blog : Redirect to /blog/:id
else Update fails
    Articles --> Admin : Update fails
end
@enduml
```

- Delete Article: axios.delete('/api/articles/:id')
  - If delete fails:
    - Stay on this step and return an error.
  - If delete succeeds:
    - Redirect to /blog and retrieve new data.

```plantuml
@startuml
actor Admin
Admin -> Articles : Delete Article
alt Deletion succeeds
    Articles --> Admin : Deletion succeeds
    Admin -> Blog : Redirect to /blog
else Deletion fails
    Articles --> Admin : Deletion fails
end
@enduml
```

## 3.1 Uploading Images

- In /admin/articles:
  - Upload Image: axios.post('/api/articles/image', formData)
    - If upload fails:
      - Return an error message.
    - If upload succeeds:
      - Retrieve the public S3 URL.
      - Use TinyURL API to shorten the URL.
      - Display the shortened URL.

```plantuml
@startuml
actor Admin
Admin -> Articles : Upload Image (formData)
alt Upload succeeds
    Articles --> Admin : S3 URL retrieved
    Admin -> TinyURL : Shorten URL
    alt Shorten URL succeeds
        TinyURL --> Admin : Shortened URL retrieved
        Admin -> Articles : Display shortened URL
    else Shorten URL fails
        TinyURL --> Admin : Return error
    end
else Upload fails
    Articles --> Admin : Return error
end
@enduml
```

## 4. Managing Categories

- In /admin/categories:
  - Create Category: axios.post('/api/categories')
    - If creation fails:
      - Stay on this step and return an error.
    - If creation succeeds:
      - Retrieve new data.

```plantuml
@startuml
actor Admin
Admin -> Categories : Create Category
alt Creation succeeds
    Categories --> Admin : Creation succeeds
    Admin -> Categories : Retrieve new data
else Creation fails
    Categories --> Admin : Creation fails
end
@enduml
```

- Update Category: axios.put('/api/categories/:id')
  - If update fails:
    - Stay on this step and return an error.
  - If update succeeds:
    - Retrieve new data.

```plantuml
@startuml
actor Admin
Admin -> Categories : Update Category
alt Update succeeds
    Categories --> Admin : Update succeeds
    Admin -> Categories : Retrieve new data
else Update fails
    Categories --> Admin : Update fails
end
@enduml

```

- Delete Category: axios.delete('/api/categories/:id')
  - If delete fails:
    - Stay on this step and return an error.
  - If delete succeeds:
    - Retrieve new data.

```plantuml
@startuml
actor Admin
Admin -> Categories : Delete Category
alt Deletion succeeds
    Categories --> Admin : Deletion succeeds
    Admin -> Categories : Retrieve new data
else Deletion fails
    Categories --> Admin : Deletion fails
end
@enduml
```

## 5. Future Enhancements

### 5.1 Draft Feature for Article Creation

- Add a draft feature to the Create Article functionality:
  - Allow articles to be saved as drafts.
  - Drafts will not be published to the blog.
  - Admin can later edit and publish drafts.
  - API endpoint: `axios.post('/api/articles/draft')`
  - Draft-specific error handling:
    - If draft creation fails:
      - Stay on this step and return an error.
    - If draft creation succeeds:
      - Save the draft and allow further editing.

```plantuml
@startuml
actor Admin
Admin -> Articles : Create Draft
alt Draft creation succeeds
    Articles --> Admin : Draft creation succeeds
else Draft creation fails
    Articles --> Admin : Draft creation fails
end
@enduml
```

### 5.2 Comments Feature and User Management

- Add a comments feature to articles:
  - Introduce a `Users` model with the following fields:
    - `id` (primary key)
    - `name`
    - `email`
  - Introduce a `Comments` model with the following fields:
    - `id` (primary key)
    - `content`
    - `post_id` (foreign key to `Articles`)
    - `user_id` (foreign key to `Users`)
  - Users will be added to the database upon their first login using third-party authentication.
  - No password field is required for the `Users` model since local registration is not used.
  - When a user leaves a comment:
    - The admin will receive an email notification.
  - When the admin replies to a comment:
    - An email notification will be sent to the user who left the comment.

```plantuml
@startuml
actor User
actor Admin
User -> Comments : Leave Comment
Comments --> Admin : Admin receives notification
Admin -> Comments : Reply to Comment
alt Reply succeeds
    Comments --> User : User receives reply notification
else Reply fails
    Comments --> Admin : Reply fails
end
@enduml
```
