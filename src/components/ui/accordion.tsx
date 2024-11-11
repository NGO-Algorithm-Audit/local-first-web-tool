'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import Markdown from 'react-markdown';

const AccordionItem = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
        ref={ref}
        className={cn('border-b', className)}
        {...props}
    />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                'flex flex-1 items-center justify-start p-2 rounded-lg text-md bg-aaLight text-black transition-all text-left [&[data-state=open]>svg]:rotate-180',
                className
            )}
            {...props}
        >
            <ChevronDown
                size={24}
                className="shrink-0 text-muted-foreground transition-transform duration-200"
            />
            {children}
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
        {...props}
    >
        <div className={cn('pb-4 pt-0', className)}>{children}</div>
    </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export interface AccordionProps {
    title: string;
    content: string;
}

export const Accordion = (props: AccordionProps) => (
    <>
        <div className="hideonprint">
            <AccordionPrimitive.Root type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>{props.title}</AccordionTrigger>
                    <AccordionContent>
                        <Markdown className="mt-2 text-gray-800 markdown px-3">
                            {props.content}
                        </Markdown>
                    </AccordionContent>
                </AccordionItem>
            </AccordionPrimitive.Root>
        </div>
        <div className="hidden showonprint">
            <Markdown className="text-gray-800 markdown">
                {props.content}
            </Markdown>
        </div>
    </>
);
