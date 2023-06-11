# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

I assume that Facilities have their own admin platform where they can create report, and manage and see shifts, and agents.

Therefore i would create 4 tickets categorised by UI, DB, and API changes.

### Tickets summary
- UI Changes
  - New field in "Facility" admin - Agent edit page - "custom_id"
- DB Changes
  - "Agent" table extra unique colum: "custom_id"
- API Changes
  - Replace Identifier value from `id` to `custom_id` in Report PDF template
  - Make sure `/agent/{id}/edit` endpoint accepts a new parameter, called: `custom_id`

### Priorities
1. DB Changes
2. API Changes
3. UI Changes


### Timeline / Estimates
First we need to make sure DB column now exists (with the default value of `id`), only then we should be able to make API changes. After API changes, finaly we can integrate it with the UI.
In order to speed up the processes, UI, DB and API changes can be worked on at the same time using mocks. 

1. DB - New column on Agent's table (2h)
2. API - Extend Agent APIs (6h)
3. API - Replace Report PDF template agent id (2h)
4. UI - New field on Agent edit page (6h)

All together my estimation is 2 mandays.

### Tickets

---

#### UI - New field on Agent edit page

###### Description
We need to add a new field to the Agent Edit page. This new field, "Custom Identifier", will allow Facilities to edit each Agent's custom ID. It will be a mandatory field that accepts unique text inputs.

###### AC 1:
- **GIVEN** I am a facilitator logged into the admin platform,
- **WHEN** I navigate to the Agent edit page,
- **THEN** I should see a new field named "Custom Identifier" according to the provided design specifications.

###### AC 2:
- **GIVEN** I am a facilitator logged into the admin platform,
- **WHEN** I visit the Agent edit page and attempt to enter a "Custom Identifier" that already exists,
- **AND WHEN** I try to save my changes,
- **THEN** I should see an error message indicating that the "Custom Identifier" must be unique.

###### AC 3:
- **GIVEN** I am a facilitator logged into the admin platform,
- **WHEN** I visit the Agent edit page and clear the "Custom Identifier" field,
- **AND WHEN** I try to save my changes,
- **THEN** I should see an error message indicating that the "Custom Identifier" field is required.

###### AC 4:
- **GIVEN** I am a facilitator logged into the admin platform,
- **WHEN** I visit the Agent edit page and fill in the "Custom Identifier" field,
- **AND WHEN** I save my changes,
- **THEN** I should refresh the browser and verify that the new "Custom Identifier" value has been saved successfully.

---

#### DB - New column on Agent's table

###### Description
We need to add a new column to the Agent table. This new field, "custom_id", will allow Facilities to set each Agent's custom ID. It will be a mandatory and unique field. As the default value, map the `id` field to `custom_id`.

###### AC 1:
- **GIVEN** I am a user with super admin rights,
- **WHEN** I navigate to Agent table,
- **THEN** I should see a new column called "custom_id"

###### AC 1:
- **GIVEN** I am a user with super admin rights,
- **WHEN** I navigate to Agent table,
- **THEN** I should see that new column called "custom_id" have the value of `id` as default.

###### AC 2:
- **GIVEN** I am a user with super admin rights,
- **WHEN** I try to create or update an Agent without a "custom_id" field,
- **THEN** I should NOT be able to see the updates i attempted to make

###### AC 3:
- **GIVEN** I am a user with super admin rights,
- **WHEN** I try to create or update an Agent with a "custom_id" that already exists,
- **THEN** I should NOT be able to see the updates i attempted to make

###### AC 4:
- **GIVEN** I am a user with super admin rights,
- **WHEN** I create or update an Agent and set the "custom_id" with a unique value,
- **AND WHEN** I save my changes,
- **THEN** I should be able to query the Agent table using the new "custom_id" and get the correct Agent data.

---

#### API - Replace Report PDF template agent id

###### Description
Reports from now on should contain a custom id instead of default DB id in the generated PDFs.

###### Dev Notes:
Make sure that `id` field in Report PDF templates are replaced with `custom_id`.

###### AC 1:
- **GIVEN** I am a facilitator logged into the admin platform,
- **WHEN** I navigate to an agent's edit page,
- **AND WHEN** I change and save custom identifier field
- **AND WHEN** I click the "Generate Report" button
- **THEN** I should see a PDF that contains the correct Identifier for the given Agent.

---

#### API - Extend Agent APIs

###### Description
- Make sure that `/agent/{id}/edit` endpoint accepts `custom_id` field, and writes it to DB.
- Make sure that `/agent/{id}/` returns field `custom_id`.
- Make sure error handling is in place for the new `custom_id` field.
    - Required: "The custom identifier field is required"
    - Unique: "The given custom identifier already exists"

###### AC 1:
- **GIVEN** I am a user with super admin rights,
- **WHEN** I try to POST to `/agent/{id}/edit` endpoint with empty `custom_id`,
- **THEN** I should see a standard error response indicating that `custom_id` field is required.

###### AC 2:
- **GIVEN** I am a user with super admin rights,
- **WHEN** I try to POST to `/agent/{id}/edit` endpoint with `custom_id` that already exists,
- **THEN** I should see a standard error response indicating that `custom_id` field sould be unique.

###### AC 3:
- **GIVEN** I am a user with super admin rights,
- **WHEN** I try to POST to `/agent/{id}/edit` endpoint with a valid `custom_id`,
- **THEN** I should see a `200 OK` response,

###### AC 4:
- **GIVEN** I am a user with super admin rights,
- **WHEN** I try to POST to `/agent/{id}/edit` endpoint with a valid `custom_id`,
- **AND WHEN** I call `/agent/{id}/` endpoint,
- **THEN** I should see the correct `custom_id` field in the response,