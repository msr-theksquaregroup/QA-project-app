Feature: checkContact.cy 1.js Functionality
As a user of the application
I want to interact with the checkcontact.cy 1.js
So that I can achieve my testing goals

Background:
  Given I open the application at "https://www.udaykumar.tech/"
  And the page loads successfully

Scenario: Application functionality test
  When I navigate to "https://www.udaykumar.tech/"
  Then the element "url" should be validated
  When I enter "Uday Kumar" in "input#name"
  Then the element "input#name" should be validated
  When I enter "7670848696" in "#outlined-basic"
  Then the element "#outlined-basic" should be validated
  When I enter "udaykumarvalapudasu@gmail.com" in "#emailID"
  Then the element "#emailID" should be validated
