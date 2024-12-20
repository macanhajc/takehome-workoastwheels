# TODO

First, I focused on organizing the existing layout. Drawing inspiration from similar websites, I began by separating the initial filters (dates and times) into a card for better clarity. I then created a reusable navigation component that allows users to easily return to the main page when needed.

Next, I worked on improving the vehicle list display. I added new data points and enhanced the pricing information to give users a clearer understanding of costs. I also updated the pagination to show the number of pages, the current page, and details like the number of cars available (based on current filters) and the number of items per page.

The last major update was adding the sortBy feature. This required me to update the backend procedure, including adding the necessary fields and validations in line with our current tech stack.

Finally, I created the filters. This step was straightforward since the backend already had the required data. I just had to design the form and integrate the fields.

This project took me approximately 4 hours to complete.

## CHANGELOG

### Search Page

#### Frontend

- Rework on headera and created a nav
- Moved date filters to a separate card.
- Added car quantity display with pagination count.
- Improved pagination component with page numbers.
- Updated listing item card:
  - Added car thumbnail.
  - Display more details: model, passengers, year, classification, price/hour, and price based on filters.
  - Made the entire card clickable on mobile (removed button).
- Added new filters:
  - Filter by make, vehicle class, price range, and passenger count.
- Added vehicle list sorting options.

#### Backend

- Added sortBy option to the vehicle search procedure.


### Review Page

#### UI
 
- Added new nav component.