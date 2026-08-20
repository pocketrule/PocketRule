# PocketRule 1.17.5

## Percentage preservation fix

- Saved active plans now display the exact percentage stored in the rule, including decimal percentages.
- Removed percentage recalculation from rounded category budget amounts on the active-plan screen.
- Prevents valid 100% rules from displaying totals such as 101% or 102% because of independent rounding.
- Monetary category allocations continue to use whole currency units and reconcile to the plan total.
- Bumped release version to 1.17.5 (version code 11705).
