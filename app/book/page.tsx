import { BookingClient } from "@/components/booking/booking-client";
import { getBookingOptions } from "@/lib/repositories";

export default async function BookingPage() {
  const hotels = await getBookingOptions();

  return <BookingClient hotels={JSON.parse(JSON.stringify(hotels))} />;
}

