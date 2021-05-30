# ImPresent

<img src="ImPresent.Web/ClientApp/src/assets/impresent_logo.png" width="300px">

<br>

Impresent is a Webapp to manage student presence during time of COVID, when schools can't afford to have everyone on site.

The app should be used by : 

- The class representative
- the students

The workflow is the following

The class rep :

1. Can create a class (promotion)
2. Adds the students to his class (csv imports supported)
3. Can create a day of presence for a target date
4. Share the volunteering link to the class
5. Waits for the students volunteer using the link
6. Can add people that have not volunteered to reach the minimum of attendees, based on their last presence date
7. Can export the final presence list for the day to send it to the school admin

![Login](screenshots/login.png)
![Promotion](screenshots/promotion.png)

Future in developement : 

- Students can unvolunteer
- Min and max attendees for a given day can be parametered for each day

## Run

### Environnement variables 

| Name | Description | Exemple Value |
| ---- | ----------- | ------------- |
| `DATABASE_URL` | Connection string to the PostgresSQL database | postgres://user:password@host:port/database |
| `JWT_SECRET` | Secret used to sign JWT tokens | 3myB8HRUokgD2uFejKyev4^4 |


Check that you have the .NET 5 SDK installed.

```bash
git clone https://github.com/Ombrelin/impresent.git
cd ImPresent.Web/ClientApp
npm install
cd ..
dotnet run
```

The app is ready when the following log line is printed : 

```
Microsoft.AspNetCore.SpaServices[0] Browser application bundle generation complete.
```

The WebApi docs are available at the `/docs` routes.

## Deploy with Docker

```bash
git clone https://github.com/Ombrelin/impresent.git
cd ImPresent.Web
docker build -t ImPresent.Web .
docker run -d -p 8080:80 ImPresent.Web
```

or with `docker-compose` :

```yml
  impresent:
    image: ombrelin/impresent:1.0
    ports:
        - 80:8080
    container_name: impresent
    environment:
      - JWT_SECRET="mysecret"
      - DATABASE_URL="my postgres url"
    restart: unless-stopped
```

## Build with

- .NET 5 & C#
- Tyepscript
- Angular 12
- ASP .NET Core
- Entity Framework Core
- Swagger
- PostgreSQL
- Docker

## Thanks

- 
- [@Grandkhan](https://github.com/Grandkhan) for the app icon