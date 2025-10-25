#!/usr/bin/env bash
# exit on error
set -o errexit

dotnet restore
dotnet build --configuration Release
dotnet publish --configuration Release --output out
