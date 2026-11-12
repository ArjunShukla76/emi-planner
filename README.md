# EMI & Prepayment Planner

A simple web app that calculates a loan's monthly EMI and shows how much interest and time you save by making extra monthly prepayments.

**Live demo:** https://arjunshukla76.github.io/emi-planner/

## Features
- Monthly EMI, total interest and total payment
- Full month-by-month amortization schedule (interest, principal, balance)
- Prepayment simulator: shows interest saved and months saved
- Indian rupee formatting and basic input validation

## Tech stack
HTML, CSS, JavaScript (no frameworks or libraries)

## How to run
Download or clone the repo and open `index.html` in a browser.

## The main problem I solved
Building the amortization schedule: each month interest is calculated on the remaining balance, and the rest of the payment reduces the principal. Adding prepayment meant recalculating the schedule so the loan ends early, and handling the final month so the last payment never exceeds the remaining balance. I compare the schedule with and without prepayment to calculate savings.

## What I'd add next
- Chart of principal vs interest over time
- Support for changing interest rates
- Export schedule as CSV
