import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
    return (
        <div className="container py-10 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>How do I start streaming?</AccordionTrigger>
                    <AccordionContent>
                        Sign up as an artist and go to your dashboard to start a broadcast.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Is SoundSync free?</AccordionTrigger>
                    <AccordionContent>
                        Yes, for fans! Artists and merchants have different subscription tiers.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
