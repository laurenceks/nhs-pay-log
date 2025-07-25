import { z } from "zod";
import {
    rowIdValidationSchema,
    shiftDateValidationSchema,
} from "./commonValidationSchemas";
import { registerValidationSchema } from "./registerValidationSchema";
import allowFirstFromAndLastTo from "../../client/src/reducers/allowFirstFromAndLastTo";
import dayjs from "dayjs";
import { Contract } from "../../../types/commonTypes";

const employmentNameMessage = "An employment name must be entered";

const commonEmploymentValidationSchema = (contracts?: Contract[]) =>
    z
        .object({
            id: rowIdValidationSchema("Employment ID"),
            name: z.string(employmentNameMessage).min(1, employmentNameMessage),
            contracts: z
                .array(
                    registerValidationSchema
                        .pick({
                            employment_name: true,
                            pay_group_id: true,
                            personal_allowance: true,
                            weekly_hours: true,
                            student_loan: true,
                            pension_perc: true,
                            hca_group_id: true,
                        })
                        .extend({
                            student_loan:
                                registerValidationSchema.shape.student_loan.nullable(),
                            hca_group_id:
                                registerValidationSchema.shape.hca_group_id.nullable(),
                            from: shiftDateValidationSchema("from").nullable(),
                            to: shiftDateValidationSchema("from").nullable(),
                            employment_id:
                                rowIdValidationSchema("Employment ID"),
                        })
                        .refine((val) => {
                            if (val.from && val.to) {
                                return new Date(val.from) < new Date(val.to);
                            } else {
                                return true;
                            }
                        }, "From cannot be after to")
                )
                .min(1, "An employment must have at least one contract"),
        })
        .refine((val) => {
            const { allowFirstFrom, allowLastTo } = allowFirstFromAndLastTo(
                val.id,
                contracts
            );

            let firstFromValid: boolean;
            let lastToValid: boolean;
            if (allowFirstFrom && !!val.contracts[0].from) {
                firstFromValid = dayjs(
                    val.contracts[0].from,
                    "YYYY-MM-DD"
                ).isValid();
            } else {
                firstFromValid =
                    val.contracts[0].from === null ||
                    val.contracts[0].from === "";
            }
            if (allowLastTo && !!val.contracts[val.contracts.length - 1].to) {
                lastToValid = dayjs(
                    val.contracts[val.contracts.length - 1].to,
                    "YYYY-MM-DD"
                ).isValid();
            } else {
                lastToValid =
                    val.contracts[val.contracts.length - 1].to === null ||
                    val.contracts[val.contracts.length - 1].to === "";
            }
            return firstFromValid && lastToValid;
        }, "At least one employment must have one contract with no from and no to");

export const clientEmploymentValidationSchema =
    commonEmploymentValidationSchema();
export const apiEmploymentValidationSchema = (contracts: Contract[]) =>
    commonEmploymentValidationSchema(contracts);
