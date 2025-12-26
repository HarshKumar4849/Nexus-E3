import MobileLayout from "@/components/MobileLayout";
import BackButton from "@/components/BackButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I track my bus in real-time?",
    answer: "Open the app and go to the Home page. You'll see a map with your bus's current location. The bottom card shows the route details and estimated arrival times for each stop.",
  },
  {
    question: "Can I change my bus route?",
    answer: "Yes, you can change your route from the Profile section or by contacting the transport department. Changes will take effect from the next day.",
  },
  {
    question: "What should I do if my bus is delayed?",
    answer: "You'll receive notifications about any delays. You can also check the app for real-time updates on your bus location and revised arrival times.",
  },
  {
    question: "How do I contact my driver?",
    answer: "Go to Driver's Info from the sidebar menu. You'll find the driver's details and a call button to contact them directly.",
  },
  {
    question: "How accurate is the location tracking?",
    answer: "Our tracking uses GPS with high accuracy. Location updates happen every 10 seconds when the bus is in motion.",
  },
];

const FAQs = () => {
  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen px-8 py-6">
        <BackButton to="/settings" />
        
        <div className="flex-1 pt-8">
          <h1 className="text-2xl font-bold text-foreground text-center mb-8">
            FAQs
          </h1>

          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-muted rounded-2xl px-4 border-none"
              >
                <AccordionTrigger className="text-left text-foreground hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </MobileLayout>
  );
};

export default FAQs;
