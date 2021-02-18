FROM mcr.microsoft.com/dotnet/core/aspnet:5.0 AS base
RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash \
    && apt-get install nodejs -yq
WORKDIR /app
EXPOSE 80
EXPOSE 443
EXPOSE 5001

FROM mcr.microsoft.com/dotnet/core/sdk:5.0 AS build
RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash \
    && apt-get install nodejs -yq
WORKDIR /src
COPY ["ImPresent.Web.csproj", "ImPresent/"]
RUN dotnet restore "ImPresent/ImPresent.Web.csproj"

COPY ./ /src/impresent
WORKDIR "/src/impresent"
RUN ls
RUN dotnet build "ImPresent.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ImPresent.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "impresent.dll"]