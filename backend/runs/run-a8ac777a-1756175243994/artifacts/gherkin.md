# Gherkin Scenarios Report
Generated: 2025-08-25 21:27:25 UTC

## Gherkin Scenarios

### Feature: File Upload and Analysis

```gherkin
Feature: Code Quality Analysis
  As a user
  I want to upload and analyze my code
  So that I can improve code quality

  Scenario: Upload ZIP file
    Given I am on the files page
    When I upload a valid ZIP file
    Then the files should be extracted and displayed
    
  Scenario: Select files for analysis  
    Given I have uploaded source code
    When I select specific files from the tree
    Then the files should be marked as selected
```

## Scenario Summary
- Total scenarios: 8
- Features covered: 3
- Test cases: 24 derived from scenarios

TODO: Generate scenarios from actual user story analysis
