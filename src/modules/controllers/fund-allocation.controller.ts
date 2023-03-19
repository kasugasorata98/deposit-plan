import { Customer } from '../../entities/customer.entity'
import { FundDeposit } from '../../entities/fund-deposit.entity'
import { FundAllocationService } from '../services/fund-allocation.service'

export class FundAllocationController {
  private customer: Customer
  private fundAllocationService: FundAllocationService
  constructor(customer: Customer) {
    // Create new instance of FundAllocationService and set the customer object
    this.fundAllocationService = new FundAllocationService()
    this.customer = customer
  }

  allocateFunds(fundDeposits: FundDeposit[]): Customer {
    //Calculate total deposit amount
    const totalDepositAmount =
      this.fundAllocationService.calculateTotalDepositAmount(fundDeposits)

    //Calculate total allocation amount from deposit plans
    const totalAllocationAmount =
      this.fundAllocationService.calculateTotalAllocationAmount(
        this.customer.depositPlans
      )

    //If total allocation amount exceeds total deposit amount, adjust allocation amount
    this.customer.depositPlans =
      this.fundAllocationService.adjustAllocationAmount(
        this.customer.depositPlans,
        totalAllocationAmount,
        totalDepositAmount
      )

    //  Allocate funds to portfolios based on deposit plans
    this.customer = this.fundAllocationService.allocateFundsToPortfolio(
      this.customer
    )
    // Return the updated customer object with updated portfolio balances
    return this.customer
  }
}
