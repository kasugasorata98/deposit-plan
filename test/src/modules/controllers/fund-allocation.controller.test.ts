import { Customer } from '../../../../src/entities/customer.entity'
import { DepositPlan } from '../../../../src/entities/deposit-plan.entity'
import { FundDeposit } from '../../../../src/entities/fund-deposit.entity'
import { Portfolio } from '../../../../src/entities/portfolio.entity'
import { FundAllocationController } from '../../../../src/modules/controllers/fund-allocation.controller'

describe('FundAllocationController', () => {
  let controller: FundAllocationController

  beforeEach(() => {
    const depositPlans: DepositPlan[] = [
      { portfolioName: 'High risk', amount: 10000 },
      { portfolioName: 'Retirement', amount: 500 },
    ]
    const portfolios: Portfolio[] = [
      { name: 'High risk', balance: 0 },
      { name: 'Retirement', balance: 0 },
    ]
    const customer: Customer = { depositPlans, portfolios }
    controller = new FundAllocationController(customer)
  })

  describe('validate', () => {
    it('should not throw an error when given valid customer data and fund deposits', () => {
      const customer = {
        portfolios: [
          { name: 'High Risk', balance: 0 },
          { name: 'Retirement', balance: 0 },
        ],
        depositPlans: [
          { portfolioName: 'High Risk', amount: 500 },
          { portfolioName: 'Retirement', amount: 100 },
        ],
      }
      const fundDeposits = [{ amount: 100 }, { amount: 200 }]
      const fundAllocationController = new FundAllocationController(customer)

      expect(() => {
        fundAllocationController.validate(customer, fundDeposits)
      }).not.toThrow()
    })

    it('should not throw an error when given valid customer data with no deposit plans and fund deposits', () => {
      const customer = {
        portfolios: [
          { name: 'High Risk', balance: 0 },
          { name: 'Retirement', balance: 0 },
        ],
        depositPlans: [],
      }
      const fundDeposits = [{ amount: 100 }, { amount: 200 }]
      const fundAllocationController = new FundAllocationController(customer)

      expect(() => {
        fundAllocationController.validate(customer, fundDeposits)
      }).not.toThrow()
    })

    it('should not throw an error when given valid customer data and no fund deposits', () => {
      const customer = {
        portfolios: [
          { name: 'High Risk', balance: 0 },
          { name: 'Retirement', balance: 0 },
        ],
        depositPlans: [
          { portfolioName: 'High Risk', amount: 500 },
          { portfolioName: 'Retirement', amount: 100 },
        ],
      }
      const fundDeposits: FundDeposit[] = []
      const fundAllocationController = new FundAllocationController(customer)

      expect(() => {
        fundAllocationController.validate(customer, fundDeposits)
      }).not.toThrow()
    })
    it('should throw an error if any deposit plan has an amount less than or equal to zero', () => {
      const customer: Customer = {
        depositPlans: [
          { portfolioName: 'High Risk', amount: 10000 },
          { portfolioName: 'Retirement', amount: -500 },
        ],
        portfolios: [],
      }
      const fundDeposits: FundDeposit[] = [{ amount: 100 }, { amount: 100 }]
      const fundAllocationController = new FundAllocationController(customer)

      expect(() => {
        fundAllocationController.validate(customer, fundDeposits)
      }).toThrow('Deposit Plans must be a positive number')
    })

    it('should throw an error if any fund deposit amount is less than or equal to zero', () => {
      const customer: Customer = {
        depositPlans: [
          { portfolioName: 'High Risk', amount: 10000 },
          { portfolioName: 'Retirement', amount: 500 },
        ],
        portfolios: [],
      }
      const fundDeposits: FundDeposit[] = [{ amount: 100 }, { amount: 0 }]
      const fundAllocationController = new FundAllocationController(customer)

      expect(() => {
        fundAllocationController.validate(customer, fundDeposits)
      }).toThrow('Fund Deposits must be a positive number')
    })
  })

  describe('allocateFunds', () => {
    it('should allocate funds to the correct portfolios based on the provided deposit plans and fund deposits', () => {
      const fundDeposits: FundDeposit[] = [{ amount: 10500 }, { amount: 100 }]
      const result = controller.allocateFunds(fundDeposits)
      expect(result.portfolios[0].balance).toBe(10000)
      expect(result.portfolios[1].balance).toBe(500)
    })
    it('should return the original customer object when no fund deposits are provided', () => {
      const result = controller.allocateFunds([])
      expect(result).toEqual(controller['customer'])
    })

    it('should return the original customer object when no deposit plans are provided', () => {
      controller['customer'].depositPlans = []
      const fundDeposits: FundDeposit[] = [{ amount: 10500 }, { amount: 100 }]
      const result = controller.allocateFunds(fundDeposits)
      expect(result).toEqual(controller['customer'])
    })

    it('should return the original customer object when the total deposit amount is zero', () => {
      const fundDeposits: FundDeposit[] = [{ amount: 0 }]
      const result = controller.allocateFunds(fundDeposits)
      expect(result).toEqual(controller['customer'])
    })

    it('should return the original customer object when the total allocation amount is zero', () => {
      controller['customer'].depositPlans = []
      const fundDeposits: FundDeposit[] = [{ amount: 100 }]
      const result = controller.allocateFunds(fundDeposits)
      expect(result).toEqual(controller['customer'])
    })

    it('should adjust allocation amounts when the total allocation amount is greater than the total deposit amount', () => {
      const depositPlans: DepositPlan[] = [
        { portfolioName: 'High risk', amount: 10000 },
        { portfolioName: 'Retirement', amount: 5000 },
      ]
      const portfolios: Portfolio[] = [
        { name: 'High risk', balance: 0 },
        { name: 'Retirement', balance: 0 },
      ]
      const customer: Customer = { depositPlans, portfolios }
      controller = new FundAllocationController(customer)

      const fundDeposits: FundDeposit[] = [{ amount: 1000 }]
      const result = controller.allocateFunds(fundDeposits)
      expect(result.portfolios[0].balance).toBeCloseTo(666.6666666666666)
      expect(result.portfolios[1].balance).toBeCloseTo(333.3333333333333)
    })
  })
})
