import { DepositPlan } from './deposit-plan.entity'
import { Portfolio } from './portfolio.entity'

export interface Customer {
  portfolios: Portfolio[]
  depositPlans: DepositPlan[]
}
