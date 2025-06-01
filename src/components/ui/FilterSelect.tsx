import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from './form';
import { useTranslation } from 'react-i18next';

const FormSchema = z.object({
    selectedFilter: z
        .string({
            required_error: 'form.errors.required',
        })
        .nonempty(),
});

export default function FilterSelect({
    onFilter,
    defaultValue,
    filterValues,
}: {
    onFilter: (value: string) => void;
    defaultValue: string;
    filterValues: string[];
}) {
    const { t } = useTranslation();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            selectedFilter: defaultValue,
        },
    });

    return (
        <Form {...form}>
            <div className="">
                <form className="flex flex-col">
                    <fieldset>
                        <div className="grid gap-3">
                            <FormField
                                control={form.control}
                                name="selectedFilter"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex flex-row items-center gap-1">
                                            {t(
                                                'biasSettings.form.fieldsets.data.filterSelect'
                                            )}
                                        </FormLabel>
                                        <Select
                                            onValueChange={value => {
                                                onFilter(value);
                                                field.onChange();
                                            }}
                                            key={`filterSelect_select`}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={t(
                                                            'biasSettings.form.actions.filterSelect'
                                                        )}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {filterValues.map(column => (
                                                    <SelectItem
                                                        key={`filterValue_${column}`}
                                                        value={column}
                                                    >
                                                        {column}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </fieldset>
                </form>
            </div>
        </Form>
    );
}
