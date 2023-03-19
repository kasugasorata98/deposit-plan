import { Customer } from '../../entities/customer.entity'
import { DepositPlan } from '../../entities/deposit-plan.entity'
import { FundDeposit } from '../../entities/fund-deposit.entity'

export class FundAllocationService {
  // Calculates the total deposit amount from an array of fund deposits
  calculateTotalDepositAmount(fundDeposits: FundDeposit[]): number {
    return fundDeposits.reduce((acc, cur) => acc + cur.amount, 0)
  }
  // Calculates the total allocation amount from an array of deposit plans
  calculateTotalAllocationAmount(depositPlans: DepositPlan[]): number {
    return depositPlans.reduce((acc, cur) => acc + cur.amount, 0)
  }
  // Adjusts deposit plan amounts if the total allocation amount exceeds the total deposit amount
  adjustAllocationAmount(
    depositPlans: DepositPlan[],
    totalAllocationAmount: number,
    totalDepositAmount: number
  ): DepositPlan[] {
    if (totalAllocationAmount > totalDepositAmount) {
      const adjustmentRatio = totalDepositAmount / totalAllocationAmount
      depositPlans.forEach(depositPlan => {
        depositPlan.amount *= adjustmentRatio
      })
    }
    return depositPlans
  }
  // Allocates funds to portfolios based on deposit plans
  allocateFundsToPortfolio(customer: Customer): Customer {
    customer.depositPlans.forEach(depositPlan => {
      const portfolio = customer.portfolios.find(
        p => p.name === depositPlan.portfolioName
      )
      if (portfolio) {
        const allocationAmount = depositPlan.amount
        portfolio.balance += allocationAmount
      }
    })
    return customer
  }
}
