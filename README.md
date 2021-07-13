# Small 2FA React Application
This application allows the user to complete 2FA process. First screen needs a user phone number, so that 6 digit OTP code can be send it to the provided number. It takes user to next screen which allows the user to enter the code and verify it with the system.

## Components
### Views 
1- Send and generate 6 digit 2FA to the provided number.

2- Enter and verify the code from the system.

## APIS
### 1. Generate 6 digit OTP Code
### Description
This API generate 6 digit OTP and with the help of jwt we are putting expiry time and encoded the sensitive information. This token then send it in response of the API. 
### POST http://localhost:3020/api/v1/two-factor-authentication/generate-code
### Body
```json
{
    "phone_number": "03215529123"
}
```
### Response
```json
{
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZV9udW1iZXIiOiIwMzIxNTUyOTM1OCIsImNvZGUiOjk5NDQ1NCwiaWF0IjoxNjI2MTY4ODM3LCJleHAiOjE2MjYxNjg4OTd9.V2jrpF6Lavro8LH6tiXGWk-XZSzEL0YxV6wrYrLkuqQ",
    "error": null,
    "message": "6 digit code has been sent to your provided number!"
}
```


### 2. Verify OTP code
### Description
This API recieves the code and token(provided by the generate API), and with the help of the token API is checking that entered code is valid or not.
### POST http://localhost:3020/api/v1/two-factor-authentication/verify-code
### Body
```json
{
    "code": "994454",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZV9udW1iZXIiOiIwMzIxNTUyOTM1OCIsImNvZGUiOjk5NDQ1NCwiaWF0IjoxNjI2MTY4ODM3LCJleHAiOjE2MjYxNjg4OTd9.V2jrpF6Lavro8LH6tiXGWk-XZSzEL0YxV6wrYrLkuqQ"

}
```
### Response
```json
{
    "data": true,
    "error": null,
    "message": "You 6 digit code has been verified successfully!"
}
```
