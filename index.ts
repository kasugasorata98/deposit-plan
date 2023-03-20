import { Customer } from './src/entities/customer.entity'
import { DepositPlan } from './src/entities/deposit-plan.entity'
import { FundDeposit } from './src/entities/fund-deposit.entity'
import { Portfolio } from './src/entities/portfolio.entity'
import { FundAllocationController } from './src/modules/controllers/fund-allocation.controller'

function main() {
  // Create portfolio objects for High Risk and Retirement
  const highRiskPortfolio: Portfolio = { name: 'High risk', balance: 0 }
  const retirementPortfolio: Portfolio = { name: 'Retirement', balance: 0 }

  // Create one-time and monthly deposit plans
  const oneTimeDepositPlan: DepositPlan[] = [
    { portfolioName: 'High risk', amount: 10000 },
    { portfolioName: 'Retirement', amount: 500 },
  ]
  const monthlyDepositPlan: DepositPlan[] = [
    { portfolioName: 'Retirement', amount: 100 },
  ]
  // Create customer object with portfolios and deposit plans
  const customer: Customer = {
    portfolios: [highRiskPortfolio, retirementPortfolio],
    depositPlans: [...oneTimeDepositPlan, ...monthlyDepositPlan],
  }
  // Create fund deposits to allocate to portfolios
  const fundDeposits: FundDeposit[] = [{ amount: 10500 }, { amount: 100 }]

  // Create FundAllocationController instance and allocate funds to customer's portfolios
  const fundAllocationController = new FundAllocationController(customer)
  fundAllocationController.validate(customer, fundDeposits)
  const { portfolios } = fundAllocationController.allocateFunds(fundDeposits)

  // Print the updated balances of each portfolio
  console.log(portfolios)
}

try {
  main()
} catch (err: any) {
  console.log({
    error: err?.message,
  })
}
