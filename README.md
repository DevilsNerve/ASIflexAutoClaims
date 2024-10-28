# Claims Automation Script


**Legal Disclaimer**

This Claims Automation Script is provided solely for informational and educational purposes. By using or implementing this script, you acknowledge and agree to the following terms and conditions:

1. **Authorized Access and Compliance**: This script is intended for authorized use only. Users must ensure they have the necessary permissions to automate interactions with any online claims portal. Unauthorized use or access of third-party systems may violate terms of service or legal agreements.

2. **No Warranties**: This script is provided "as is," without warranty of any kind, express or implied. The developers of this script disclaim all warranties, including but not limited to the implied warranties of merchantability and fitness for a particular purpose.

3. **Limited Liability**: The developers of this script are not responsible for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, data loss, unauthorized access, or business interruption) arising from the use or inability to use this script.

4. **User Responsibility**: Users are solely responsible for verifying the compatibility, accuracy, and legality of using this script within their systems and environments. Additionally, any modifications or customizations made to this script are the responsibility of the user, including the handling of any claims data.

5. **No Endorsement of Third-Party Services**: This script is not affiliated with or endorsed by any third-party services, including Asiflex or its Claims Portal. Users are advised to review and comply with all relevant policies of any third-party services they interact with.


![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Setting Up Local Overrides in Chrome](#setting-up-local-overrides-in-chrome)
  - [Adding the Automation Script](#adding-the-automation-script)
- [Configuration](#configuration)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Overview

The **Claims Automation Script** is a JavaScript tool designed to automate the insertion of claim data into the [Asiflex Claims Portal](https://my.asiflex.com/claims_03.aspx). By leveraging predefined data sets, this script streamlines the process of populating form fields and submitting claims, significantly reducing manual effort and minimizing errors.

**Note:** This script utilizes browser local overrides to inject custom JavaScript into the Asiflex Claims Portal. Ensure you have the necessary permissions and comply with all relevant policies before using this automation tool.

## Features

- **Automated Data Entry:** Automatically fills out multiple form fields based on a predefined data set.
- **Dynamic Formatting:** Ensures that numerical amounts are correctly formatted by interacting with the form fields.
- **Error Handling:** Logs errors both in the console and on the webpage for easy debugging.
- **Progress Tracking:** Provides real-time status updates on the processing of claims.
- **Customizable:** Easily configurable to accommodate different data sets and form field identifiers.

## Prerequisites

- **Google Chrome Browser:** This guide uses Chrome's DevTools for local overrides. Ensure you have the latest version installed.
- **Access to Asiflex Claims Portal:** Ensure you have the necessary permissions and credentials to access [Asiflex Claims Portal](https://my.asiflex.com/claims_03.aspx).
- **Basic Knowledge of Browser Developer Tools:** Familiarity with accessing and using Chrome's Developer Tools is beneficial.

## Installation

### Setting Up Local Overrides in Chrome

1. **Open Google Chrome and Navigate to Asiflex Claims Portal:**

   - Go to [https://my.asiflex.com/claims_03.aspx](https://my.asiflex.com/claims_03.aspx) and log in with your credentials.

2. **Open Chrome Developer Tools:**

   - Press `F12` or `Ctrl+Shift+I` (`Cmd+Option+I` on Mac) to open Developer Tools.

3. **Enable Local Overrides:**

   - In Developer Tools, go to the **Sources** tab.
   - In the left sidebar, click on the **Overrides** section.
   - If you don't see **Overrides**, click on the `»` icon to reveal more sections.
   - Click on **Enable Local Overrides**.
   - You'll be prompted to select a folder on your local machine where Chrome will store override files. **Choose an empty folder** and grant Chrome access.
   - Once set, you should see a green **Overrides** badge indicating that local overrides are active.

   ![Enable Local Overrides]

### Adding the Automation Script

1. **Identify the Target Script:**

   - While on the Asiflex Claims Portal page, in Developer Tools, navigate to the **Sources** tab.
   - Locate the main JavaScript file that handles form submissions. This might require some inspection. Commonly, it could be named something like `claims.js`, `main.js`, or similar.
   - **Tip:** Look for scripts that interact with form elements or handle claim submissions.

2. **Create a Local Override for the Target Script:**

   - Right-click on the target script file in the **Sources** panel.
   - Select **Save for overrides**. Chrome will save a copy of this script in your designated overrides folder.

3. **Edit the Overridden Script:**

   - After saving for overrides, the script will open in the **Sources** panel with the **Overrides** label.
   - Scroll to the bottom of the script and **paste** the automation script provided below.

   ```javascript
   // ==============================
   // Claims Automation Script
   // ==============================

   (function() {
       'use strict';
   
       // ==============================
       // Configuration Section
       // ==============================
   
       // Define the CSV data as a JavaScript array of objects
       const csvData = [
           {
               "Claim Number": "CLAIM_NUMBER_1",
               "Patient Name": "PATIENT_NAME_1",
               "Date Visited": "MM/DD/YYYY",
               "Visited Provider": "PROVIDER_NAME_1",
               "Claim Type": "Claim_Type_1",
               "Your Responsibility": "$AMOUNT_1"
           },
           {
               "Claim Number": "CLAIM_NUMBER_2",
               "Patient Name": "PATIENT_NAME_2",
               "Date Visited": "MM/DD/YYYY",
               "Visited Provider": "PROVIDER_NAME_2",
               "Claim Type": "Claim_Type_2",
               "Your Responsibility": "$AMOUNT_2"
           },
           // ... [Add additional entries as needed] ...
           {
               "Claim Number": "CLAIM_NUMBER_N",
               "Patient Name": "PATIENT_NAME_N",
               "Date Visited": "MM/DD/YYYY",
               "Visited Provider": "PROVIDER_NAME_N",
               "Claim Type": "Claim_Type_N",
               "Your Responsibility": "$AMOUNT_N"
           }
       ];
   
       // ==============================
       // Helper Functions
       // ==============================
   
       /**
        * Formats a date string to MM/DD/YYYY.
        * @param {string} dateStr - The date string in M/D/YYYY format.
        * @returns {string} - The formatted date string.
        */
       function formatDate(dateStr) {
           const date = new Date(dateStr);
           if (isNaN(date)) return dateStr; // Return original string if invalid date
           const month = ('0' + (date.getMonth() + 1)).slice(-2);
           const day = ('0' + date.getDate()).slice(-2);
           const year = date.getFullYear();
           return `${month}/${day}/${year}`;
       }
   
       /**
        * Introduces a delay for asynchronous operations.
        * @param {number} ms - The delay duration in milliseconds.
        * @returns {Promise} - A promise that resolves after the specified delay.
        */
       function delay(ms) {
           return new Promise(resolve => setTimeout(resolve, ms));
       }
   
       /**
        * Fills a form field identified by its element ID with the provided value.
        * For date fields, it triggers additional events to ensure the form recognizes the change.
        * @param {string} elementId - The ID of the form field element.
        * @param {string} value - The value to set for the form field.
        * @param {boolean} isDateField - Indicates if the field is a date field.
        */
       async function fillFormField(elementId, value, isDateField = false) {
           const element = document.getElementById(elementId);
           if (element) {
               if (isDateField) {
                   // Simulate user clicking on the date field to focus
                   element.click();
                   await delay(500); // Wait for the click to register
               }
   
               element.value = value;
               console.log(`Setting field "${elementId}" to "${value}"`); // Enhanced logging
   
               // Trigger necessary events
               const inputEvent = new Event('input', { bubbles: true });
               const changeEvent = new Event('change', { bubbles: true });
               const blurEvent = new Event('blur', { bubbles: true });
               element.dispatchEvent(inputEvent);
               element.dispatchEvent(changeEvent);
               element.dispatchEvent(blurEvent);
   
               if (isDateField) {
                   console.log(`Date field "${elementId}" set to "${value}" and events triggered.`);
               } else {
                   console.log(`Field "${elementId}" set to "${value}".`);
               }
           } else {
               logError(`Element with ID "${elementId}" not found.`);
           }
       }
   
       /**
        * Logs error messages to the console and an on-page error log.
        * @param {string} message - The error message to log.
        */
       function logError(message) {
           console.error(message);
           const errorLogDiv = getErrorLogDiv();
           errorLogDiv.innerText += `${message}\n`;
       }
   
       /**
        * Retrieves or creates the error log div element for displaying errors.
        * @returns {HTMLElement} - The error log div element.
        */
       function getErrorLogDiv() {
           let errorLogDiv = document.getElementById('errorLog');
           if (!errorLogDiv) {
               errorLogDiv = document.createElement('div');
               errorLogDiv.id = 'errorLog';
               errorLogDiv.style.textAlign = 'center';
               errorLogDiv.style.marginTop = '10px';
               errorLogDiv.style.color = 'red';
               errorLogDiv.style.whiteSpace = 'pre-wrap';
               document.body.appendChild(errorLogDiv);
           }
           return errorLogDiv;
       }
   
       /**
        * Retrieves or creates the status div element for displaying processing status.
        * @returns {HTMLElement} - The status div element.
        */
       function getStatusDiv() {
           let statusDiv = document.getElementById('status');
           if (!statusDiv) {
               statusDiv = document.createElement('div');
               statusDiv.id = 'status';
               statusDiv.style.textAlign = 'center';
               statusDiv.style.marginTop = '20px';
               statusDiv.style.fontWeight = 'bold';
               statusDiv.style.color = 'green';
               document.body.appendChild(statusDiv);
           }
           return statusDiv;
       }
   
       /**
        * Retrieves existing Claim Numbers from the displayed claims table.
        * @returns {Set} - A set containing all existing Claim Numbers.
        */
       function getExistingClaimNumbers() {
           const table = document.getElementById('CLAIMS_TABLE_ID');
           if (!table) {
               logError('Claims table not found.');
               return new Set();
           }
   
           const rows = table.getElementsByTagName('tr');
           const claimNumbers = new Set();
   
           for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header
               const cells = rows[i].getElementsByTagName('td');
               if (cells.length < 7) continue; // Ensure enough cells
   
               const service = cells[6].innerText.trim(); // Service is the 7th column (0-based index 6)
   
               // Extract Claim Number from service, e.g., "Medical Claim # CLAIM_NUMBER_X"
               const match = service.match(/Claim\s+#\s+(.+)$/);
               if (match && match[1]) {
                   claimNumbers.add(match[1]);
                   console.log(`Existing Claim Number found: ${match[1]}`);
               }
           }
   
           return claimNumbers;
       }
   
       /**
        * Determines the next claim to process based on existing claims in the table.
        * @param {Set} existingClaimNumbers - Set of already processed claim numbers.
        * @returns {Object|null} - The next claim object to process or null if all are processed.
        */
       function getNextClaim(existingClaimNumbers) {
           for (const entry of csvData) {
               const claimNumber = entry["Claim Number"].trim();
               if (!existingClaimNumbers.has(claimNumber)) {
                   return entry;
               }
           }
           return null;
       }
   
       // ==============================
       // Main Processing Function
       // ==============================
   
       /**
        * Processes the next available claim from the CSV data.
        * Fills the form and submits it.
        */
       async function processNextClaim() {
           const existingClaimNumbers = getExistingClaimNumbers();
           const statusDiv = getStatusDiv();
           const errorLogDiv = getErrorLogDiv();
   
           const nextClaim = getNextClaim(existingClaimNumbers);
   
           if (!nextClaim) {
               alert('All claims have been processed.');
               statusDiv.innerText = 'All eligible entries have been processed.';
               return;
           }
   
           const claimNumber = nextClaim["Claim Number"].trim();
           const patientName = nextClaim["Patient Name"].trim();
           const dateVisited = nextClaim["Date Visited"].trim();
           const visitedProvider = nextClaim["Visited Provider"].trim();
           const claimType = nextClaim["Claim Type"].trim();
           const responsibilityStr = nextClaim["Your Responsibility"].trim();
   
           // Parse responsibility to float
           const responsibility = parseFloat(responsibilityStr.replace(/[^0-9.-]+/g, ""));
           console.log(`Parsed Responsibility: ${responsibility}`); // Log the parsed responsibility
   
           // Validate amount
           if (isNaN(responsibility) || responsibility <= 0.01) {
               logError(`Skipping Claim Number: ${claimNumber} due to invalid amount (${responsibilityStr}).`);
               return;
           }
   
           // Determine relationship based on patient name
           let relationship = "";
           if (patientName === "PATIENT_NAME_1") {
               relationship = "Relationship_1";
           } else if (patientName === "PATIENT_NAME_2") {
               relationship = "Relationship_2";
           } else if (patientName === "PATIENT_NAME_3") {
               relationship = "Relationship_3";
           } else {
               relationship = "Other"; // Default or handle as needed
           }
   
           // Map Claim Type and Claim Number to General Medical Expense Description
           const expenseDescription = `${claimType} Claim # ${claimNumber}`;
   
           // Format date as MM/DD/YYYY
           const formattedDate = formatDate(dateVisited);
   
           // Format amount without dollar sign
           const formattedAmount = formatAmount(responsibility);
           console.log(`Formatted Amount: "${formattedAmount}"`); // Log the formatted amount
   
           console.log(`Processing Claim Number: ${claimNumber}`);
   
           // Fill the form fields with a 0.5-second delay between each
           await fillFormField('DATE_FIELD_ID', formattedDate, true);
           await delay(500); // 0.5-second delay
   
           await fillFormField('PROVIDER_NAME_FIELD_ID', visitedProvider);
           await delay(500); // 0.5-second delay
   
           await fillFormField('EXPENSE_DESCRIPTION_FIELD_ID', expenseDescription);
           await delay(500); // 0.5-second delay
   
           await fillFormField('PATIENT_NAME_FIELD_ID', patientName);
           await delay(500); // 0.5-second delay
   
           await fillFormField('RELATIONSHIP_FIELD_ID', relationship);
           await delay(500); // 0.5-second delay
   
           // Fill the "Your Responsibility" amount field
           await fillFormField('RESPONSIBILITY_FIELD_ID', formattedAmount);
           await delay(500); // 0.5-second delay
   
           // === Enhanced Code Starts Here ===
           // Introduce additional delay before clicking back into the amount field
           await delay(1000); // 1-second delay to allow the value to be set and any internal processing
   
           // Click back into the amount field to trigger formatting
           const amtField = document.getElementById('RESPONSIBILITY_FIELD_ID');
           if (amtField) {
               // Simulate focusing the field
               amtField.focus();
               console.log('Focused the "Your Responsibility" amount field.');
               await delay(500); // 0.5-second delay
   
               // Simulate clicking the field
               amtField.click();
               console.log('Clicked the "Your Responsibility" amount field to trigger formatting.');
               await delay(1000); // 1-second delay to ensure formatting is applied
   
               // Simulate blurring the field to trigger any onBlur events
               amtField.blur();
               console.log('Blurred the "Your Responsibility" amount field.');
               await delay(500); // 0.5-second delay
           } else {
               logError(`Amount field with ID "RESPONSIBILITY_FIELD_ID" not found.`);
           }
           // === Enhanced Code Ends Here ===
   
           // Update status
           statusDiv.innerText = `Processing Claim Number: ${claimNumber}`;
   
           // Wait for a longer period to ensure fields are filled and formatted
           await delay(9000); // 9 seconds
   
           // Click the "Add to Claim" button
           const addButton = document.getElementById('ADD_CLAIM_BUTTON_ID');
           if (addButton) {
               addButton.click();
               console.log(`Clicked "Add to Claim" for Claim Number: ${claimNumber}`);
               statusDiv.innerText = `Submitted Claim Number: ${claimNumber}. Reloading to process next claim...`;
           } else {
               const errorMsg = `Add to Claim button not found for Claim Number: ${claimNumber}`;
               logError(errorMsg);
           }
       }
   
       // ==============================
       // Initialization on Page Load
       // ==============================
   
       /**
        * Initializes the script by setting up the UI and starting the processing.
        */
       async function initialize() {
           const statusDiv = getStatusDiv();
           statusDiv.innerText = 'Initializing claim processing...';
   
           // Delay to ensure the table is fully loaded
           await delay(2000); // 2 seconds
   
           await processNextClaim();
       }
   
       // Run the initialization when the DOM is fully loaded
       if (document.readyState === 'loading') {
           document.addEventListener('DOMContentLoaded', initialize);
       } else {
           initialize();
       }
   
   })();
   ```

4. **Save the Overridden Script:**

   - Press `Ctrl+S` (`Cmd+S` on Mac) to save the changes. Chrome will automatically apply the local override.

## Configuration

Before using the script, you need to configure it by replacing the placeholder values with actual data and element identifiers from the Asiflex Claims Portal.

1. **Edit the CSV Data:**

   - Populate the `csvData` array with your actual claim data. Replace placeholders like `"CLAIM_NUMBER_1"`, `"PATIENT_NAME_1"`, `"MM/DD/YYYY"`, etc., with real values.

     ```javascript
     const csvData = [
         {
             "Claim Number": "123456789",
             "Patient Name": "John Doe",
             "Date Visited": "07/24/2023",
             "Visited Provider": "Health Clinic A",
             "Claim Type": "Medical",
             "Your Responsibility": "$147.04"
         },
         // ... [Additional entries] ...
     ];
     ```

2. **Replace Element ID Placeholders:**

   - Update all placeholder IDs in the script with the actual IDs from the Asiflex Claims Portal form fields. Use Chrome's Developer Tools to inspect the form elements and find their IDs.

     ```javascript
     await fillFormField('DATE_FIELD_ID', formattedDate, true);
     await fillFormField('PROVIDER_NAME_FIELD_ID', visitedProvider);
     await fillFormField('EXPENSE_DESCRIPTION_FIELD_ID', expenseDescription);
     await fillFormField('PATIENT_NAME_FIELD_ID', patientName);
     await fillFormField('RELATIONSHIP_FIELD_ID', relationship);
     await fillFormField('RESPONSIBILITY_FIELD_ID', formattedAmount);
     ```

     For example:

     ```javascript
     await fillFormField('ctl00_ContentPlaceHolder1_svcdfrstC4TextBox_I', formattedDate, true);
     await fillFormField('ctl00_ContentPlaceHolder1_prvnameC4TextBox_I', visitedProvider);
     await fillFormField('ctl00_ContentPlaceHolder1_prvinfoC4TextBox_I', expenseDescription);
     await fillFormField('ctl00_ContentPlaceHolder1_pnlPerson2_bnameC4TextBox_I', patientName);
     await fillFormField('ctl00_ContentPlaceHolder1_pnlPerson4_binfoC4TextBox_I', relationship);
     await fillFormField('ctl00_ContentPlaceHolder1_amtC4TextBox_I', formattedAmount);
     ```

   - Similarly, replace `'ADD_CLAIM_BUTTON_ID'` with the actual ID of the "Add to Claim" button.

     ```javascript
     const addButton = document.getElementById('ctl00_ContentPlaceHolder1_addClaimBtn_I');
     ```

3. **Customize Relationships (If Applicable):**

   - Modify the relationship determination logic based on patient names or other criteria as needed.

     ```javascript
     let relationship = "";
     if (patientName === "John Doe") {
         relationship = "Self";
     } else if (patientName === "Jane Doe") {
         relationship = "Spouse";
     } else if (patientName === "Johnny Doe") {
         relationship = "Child";
     } else {
         relationship = "Other"; // Default or handle as needed
     }
     ```

## Usage

1. **Ensure Local Overrides are Enabled:**

   - Make sure that Chrome's local overrides are still enabled. You can verify this in the **Sources** tab under **Overrides**.

2. **Navigate to Asiflex Claims Portal:**

   - Go to [https://my.asiflex.com/claims_03.aspx](https://my.asiflex.com/claims_03.aspx) and log in with your credentials.



3. **Script Execution:**
   
   - **Automatic Execution:** Once the page loads, the overridden script will automatically execute.
   - **Processing Claims:** The script will process claims based on the `csvData` array, filling out the form fields, formatting amounts, and submitting each claim.
   - **Manual Action Required:** 
     - **Amount Field Formatting:** After the script fills in the **Amount** field, you need to **manually click within the field** to ensure the amount is formatted correctly.
     - **Quick Submission:** Be prepared to act swiftly, as the script will automatically submit the form **2 seconds** after filling the amount field.
   - **Status Updates:** A status message will appear on the webpage indicating the current processing status.
   - **Error Logs:** Any errors encountered will be displayed both in the console and within the on-page error log section.

### **Additional Tips:**

- **Be Prepared:** Have your cursor ready to click in the **Amount** field immediately after it's populated to ensure proper formatting.
- **Monitor Timing:** Since the script submits the form 2 seconds after filling the amount, ensure that your manual click happens within this timeframe to avoid submission errors.
- **Testing:** Before running the script on the entire dataset, perform a test run to familiarize yourself with the timing and manual interaction required.

4. **Monitor Progress:**

   - **Status Div (`#status`):** Shows messages like "Initializing claim processing...", "Processing Claim Number: 123456789", and "Submitted Claim Number: 123456789. Reloading to process next claim...".
   - **Error Log Div (`#errorLog`):** Displays any errors encountered during execution.

5. **Completion:**

   - Once all claims have been processed, an alert will notify you, and the status div will display that all eligible entries have been processed.

## Troubleshooting

- **Elements Not Found:**
  
  - **Issue:** The script logs errors indicating that certain elements (e.g., form fields or buttons) were not found.
  - **Solution:** Verify that the element IDs in the script match those on the Asiflex Claims Portal. Use Chrome's Developer Tools to inspect and confirm the correct IDs.

- **Formatting Issues:**
  
  - **Issue:** The "Your Responsibility" field is not being formatted correctly.
  - **Solution:** Ensure that the script includes sufficient delays before and after interacting with the field. Adjust the `await delay(ms)` durations as needed to align with the website's processing time.

- **Script Not Executing:**
  
  - **Issue:** The overridden script isn't running as expected.
  - **Solution:** 
    - Confirm that local overrides are enabled and the script is correctly appended.
    - Check the browser's console for any syntax errors or missing elements.
    - Ensure that you've replaced all placeholders with actual values.

- **Unexpected Behavior:**
  
  - **Issue:** Claims are not being submitted correctly or fields are being filled incorrectly.
  - **Solution:** 
    - Revisit the configuration section to ensure all data and element IDs are accurate.
    - Monitor console logs for specific error messages.
    - Adjust delays if the website is particularly slow in processing actions.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- Inspired by a lot of claim submital in ASI is horrible... Congrats now you have this.

---

**Disclaimer:** This script is intended for authorized use only. Ensure you have the necessary permissions to automate interactions with the Asiflex Claims Portal. Use responsibly and adhere to all relevant policies and regulations.
