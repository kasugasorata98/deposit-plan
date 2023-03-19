import { Customer } from '../../../../src/entities/customer.entity'
import { DepositPlan } from '../../../../src/entities/deposit-plan.entity'
import { FundDeposit } from '../../../../src/entities/fund-deposit.entity'
import { Portfolio } from '../../../../src/entities/portfolio.entity'
import { FundAllocationService } from '../../../../src/modules/services/fund-allocation.service'

describe('FundAllocationService', () => {
  let service: FundAllocationService

  beforeEach(() => {
    service = new FundAllocationService()
  })

  describe('calculateTotalDepositAmount', () => {
    it('should return 0 when no fund deposits are provided', () => {
      const fundDeposits: FundDeposit[] = []
      const totalDepositAmount =
        service.calculateTotalDepositAmount(fundDeposits)
      expect(totalDepositAmount).toBe(0)
    })

    it('should return the correct total amount when fund deposits are provided', () => {
      const fundDeposits: FundDeposit[] = [
        { amount: 500 },
        { amount: 1000 },
        { amount: 2000 },
      ]
      const totalDepositAmount =
        service.calculateTotalDepositAmount(fundDeposits)
      expect(totalDepositAmount).toBe(3500)
    })
  })

  describe('calculateTotalAllocationAmount', () => {
    it('should return 0 when no deposit plans are provided', () => {
      const depositPlans: DepositPlan[] = []
      const totalAllocationAmount =
        service.calculateTotalAllocationAmount(depositPlans)
      expect(totalAllocationAmount).toBe(0)
    })

    it('should return the correct total amount when deposit plans are provided', () => {
      const depositPlans: DepositPlan[] = [
        { portfolioName: 'High risk', amount: 5000 },
        { portfolioName: 'Retirement', amount: 1000 },
      ]
      const totalAllocationAmount =
        service.calculateTotalAllocationAmount(depositPlans)
      expect(totalAllocationAmount).toBe(6000)
    })
  })

  describe('adjustAllocationAmount', () => {
    it('should not adjust allocation amounts when total allocation amount is less than total deposit amount', () => {
      const depositPlans: DepositPlan[] = [
        { portfolioName: 'High risk', amount: 5000 },
        { portfolioName: 'Retirement', amount: 1000 },
      ]
      const totalAllocationAmount = 6000
      const totalDepositAmount = 7000
      const adjustedDepositPlans = service.adjustAllocationAmount(
        depositPlans,
        totalAllocationAmount,
        totalDepositAmount
      )
      expect(adjustedDepositPlans).toEqual([
        { portfolioName: 'High risk', amount: 5000 },
        { portfolioName: 'Retirement', amount: 1000 },
      ])
    })

    it('should adjust allocation amounts proportionally when total allocation amount exceeds total deposit amount', () => {
      const depositPlans: DepositPlan[] = [
        { portfolioName: 'High risk', amount: 8000 },
        { portfolioName: 'Retirement', amount: 2000 },
      ]
      const totalAllocationAmount = 10000
      const totalDepositAmount = 5000
      const adjustedDepositPlans = service.adjustAllocationAmount(
        depositPlans,
        totalAllocationAmount,
        totalDepositAmount
      )
      expect(adjustedDepositPlans).toEqual([
        { portfolioName: 'High risk', amount: 4000 },
        { portfolioName: 'Retirement', amount: 1000 },
      ])
    })
  })

  describe('allocateFundsToPortfolio', () => {
    it('should allocate funds to the correct portfolios based on the provided deposit plans', () => {
      const depositPlans: DepositPlan[] = [
        { portfolioName: 'High risk', amount: 5000 },
        { portfolioName: 'Retirement', amount: 1000 },
      ]
      const portfolios: Portfolio[] = [
        { name: 'High risk', balance: 0 },
        { name: 'Retirement', balance: 0 },
      ]
      const customer: Customer = { depositPlans, portfolios }
      service.allocateFundsToPortfolio(customer)
      expect(customer.portfolios[0].balance).toBe(5000)
      expect(customer.portfolios[1].balance).toBe(1000)
    })

    it('should not allocate funds to portfolios that are not included in the deposit plans', () => {
      const depositPlans: DepositPlan[] = [
        { portfolioName: 'High risk', amount: 5000 },
      ]
      const portfolios: Portfolio[] = [
        { name: 'High risk', balance: 0 },
        { name: 'Retirement', balance: 0 },
      ]
      const customer: Customer = { depositPlans, portfolios }
      service.allocateFundsToPortfolio(customer)
      expect(customer.portfolios[0].balance).toBe(5000)
      expect(customer.portfolios[1].balance).toBe(0)
    })

    it('should not allocate funds to portfolios that do not exist', () => {
      const depositPlans: DepositPlan[] = [
        { portfolioName: 'High risk', amount: 5000 },
        { portfolioName: 'Invalid', amount: 1000 },
      ]
      const portfolios: Portfolio[] = [{ name: 'High risk', balance: 0 }]
      const customer: Customer = { depositPlans, portfolios }
      service.allocateFundsToPortfolio(customer)
      expect(customer.portfolios[0].balance).toBe(5000)
      expect(customer.portfolios[1]).toBeUndefined()
    })
  })
})
