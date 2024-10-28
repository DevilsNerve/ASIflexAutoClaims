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
  
          console.log(`Processing Claim Number: ${claimNumber}`);
  
          // Fill the form fields with a 0.1-second delay between each
          await fillFormField('ctl00_ContentPlaceHolder1_svcdfrstC4TextBox_I', formattedDate, true);
          await delay(100); // 0.1-second delay
  
          await fillFormField('ctl00_ContentPlaceHolder1_prvnameC4TextBox_I', visitedProvider);
          await delay(100); // 0.1-second delay
  
          await fillFormField('ctl00_ContentPlaceHolder1_prvinfoC4TextBox_I', expenseDescription);
          await delay(100); // 0.1-second delay
  
          await fillFormField('ctl00_ContentPlaceHolder1_pnlPerson2_bnameC4TextBox_I', patientName);
          await delay(100); // 0.1-second delay
  
          await fillFormField('ctl00_ContentPlaceHolder1_pnlPerson4_binfoC4TextBox_I', relationship);
          await delay(100); // 0.1-second delay
  
          // Fill the "Your Responsibility" amount field
          await fillFormField('ctl00_ContentPlaceHolder1_amtC4TextBox_I', responsibilityStr);
          await delay(100); // 0.1-second delay
    
          // Click back into the amount field to trigger formatting
          const amtField = document.getElementById('ctl00_ContentPlaceHolder1_amtC4TextBox_I');
          if (amtField) {
              amtField.click();
              console.log('Clicked the "Your Responsibility" amount field to trigger formatting.');
          } else {
              logError(`Amount field with ID "ctl00_ContentPlaceHolder1_amtC4TextBox_I" not found.`);
          }
  
          // Update status
          statusDiv.innerText = `Processing Claim Number: ${claimNumber}`;
  
          // Wait for a longer period to ensure fields are filled and formatted
          await delay(2000); // 2 seconds
  
          // Click the "Add to Claim" button
          const addButton = document.getElementById('ctl00_ContentPlaceHolder1_addClaimBtn_I');
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
