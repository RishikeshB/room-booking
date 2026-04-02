"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type RoomOption = {
  _id: string;
  name: string;
  roomType: string;
  occupancy: number;
};

type HotelOption = {
  _id: string;
  name: string;
  location: string;
  rooms: RoomOption[];
};

export function BookingClient({ hotels }: { hotels: HotelOption[] }) {
  const router = useRouter();
  const [hotelId, setHotelId] = useState("");
  const [roomType, setRoomType] = useState("");
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showFullPhoto, setShowFullPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedHotel = useMemo(() => hotels.find((hotel) => hotel._id === hotelId), [hotelId, hotels]);
  const filteredRooms = useMemo(() => {
    if (!selectedHotel) {
      return [];
    }

    const rooms = selectedHotel.rooms.filter((room) => {
      const matchRoomType = roomType ? room.roomType === roomType : true;
      return matchRoomType;
    });

    // Sort by room number (extract numeric part for proper sorting)
    return rooms.sort((a, b) => {
      const numA = parseInt(a.name.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.name.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
  }, [roomType, selectedHotel]);

  const roomTypes = useMemo(() => Array.from(new Set((selectedHotel?.rooms ?? []).map((room) => room.roomType))), [selectedHotel]);

  useEffect(() => {
    setRoomType("");
    setRoomId("");
  }, [hotelId]);

  useEffect(() => {
    setRoomId("");
  }, [roomType]);

  useEffect(() => {
    if (!photoFile) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(photoFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  useEffect(() => {
    if (showCamera && videoRef.current) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [showCamera, facingMode]);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast.error("Unable to access camera. Please allow camera permissions.");
      setShowCamera(false);
    }
  }

  function switchCamera() {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  }

  function capturePhoto() {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured-photo.png", { type: "image/png" });
            setPhotoFile(file);
            setShowCamera(false);
            toast.success("Photo captured!");
          }
        }, "image/png");
      }
    }
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  }

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Validate required fields
    if (!userName.trim()) {
      toast.error("Please enter resident name");
      return;
    }

    if (!contactNumber.trim()) {
      toast.error("Please enter contact number");
      return;
    }

    setSubmitting(true);

    let photoUrl = "";
    let photoBlobName = "";

    // Upload photo if provided (optional)
    if (photoFile) {
      const formData = new FormData();
      formData.append("file", photoFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        toast.error(uploadData.error ?? "Photo upload failed");
        setSubmitting(false);
        return;
      }

      photoUrl = uploadData.url;
      photoBlobName = uploadData.blobName;
    }

    const bookingResponse = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        hotelId,
        roomId,
        userName,
        contactNumber,
        photoUrl,
        photoBlobName
      })
    });

    const bookingData = await bookingResponse.json();
    setSubmitting(false);

    if (!bookingResponse.ok) {
      toast.error(bookingData.error ?? "Booking failed");
      return;
    }

    toast.success("Room booked successfully");
    setHotelId("");
    setRoomType("");
    setRoomId("");
    setUserName("");
    setContactNumber("");
    setPhotoFile(null);
    router.refresh();
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-6">
      <form className="panel space-y-5 p-6" onSubmit={submitBooking}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Resident allocation</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">Book an available room</h2>
          <p className="mt-2 text-sm text-slate-600">Pick a hotel, narrow down by room type and bed size, capture a resident photo, and confirm the allocation.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Hotel</label>
            <Select value={hotelId} onChange={(event) => setHotelId(event.target.value)}>
              <option value="">Select hotel</option>
              {hotels.map((hotel) => <option key={hotel._id} value={hotel._id}>{hotel.name} - {hotel.location}</option>)}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Room type</label>
            <Select disabled={!hotelId} value={roomType} onChange={(event) => setRoomType(event.target.value)}>
              <option value="">Any</option>
              {roomTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Available room</label>
            <Select disabled={!hotelId || filteredRooms.length === 0} value={roomId} onChange={(event) => setRoomId(event.target.value)}>
              <option value="">Select room</option>
              {filteredRooms.map((room) => (
                <option key={room._id} value={room._id}>
                  Room No: {room.name} - {room.roomType} - {room.occupancy} {room.occupancy === 1 ? "person" : "people"}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Contact number <span className="text-red-500">*</span></label>
            <Input placeholder="Enter phone number" value={contactNumber} onChange={(event) => setContactNumber(event.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Resident name <span className="text-red-500">*</span></label>
            <Input placeholder="Enter resident name" value={userName} onChange={(event) => setUserName(event.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Resident photo <span className="text-xs text-slate-500">(optional)</span></label>
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full border-2 border-brand-200 bg-brand-50 text-brand-900 hover:bg-brand-100"
                onClick={() => setShowCamera(true)}
              >
                📷 Open Camera & Capture
              </Button>
              <div className="relative">
                <input
                  accept="image/*"
                  capture="environment"
                  className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-ink outline-none transition file:mr-3 file:rounded-xl file:border-0 file:bg-brand-100 file:px-3 file:py-2 file:font-semibold file:text-brand-900"
                  onChange={handleFileSelect}
                  type="file"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">or upload</span>
              </div>
            </div>
          </div>
        </div>

        <Button className="w-full" disabled={submitting || !hotelId || !roomId} type="submit">{submitting ? "Confirming..." : "Confirm booking"}</Button>
      </form>

      <div className="space-y-6">
        <div className="panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Selection status</p>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div className="rounded-3xl bg-mist p-4">
              <p className="font-semibold text-ink">Hotel</p>
              <p className="mt-1">{selectedHotel ? `${selectedHotel.name}, ${selectedHotel.location}` : "Choose a hotel to begin."}</p>
            </div>
            <div className="rounded-3xl bg-mist p-4">
              <p className="font-semibold text-ink">Available rooms</p>
              <p className="mt-1">{hotelId ? `${filteredRooms.length} room(s) match your selection.` : "No hotel selected yet."}</p>
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Resident preview</p>
          <div className="mt-4 overflow-hidden rounded-[28px] border border-dashed border-brand-200 bg-brand-50/70">
            {previewUrl ? (
              <div className="relative h-[360px]">
                <Image alt="Resident preview" className="object-cover" fill sizes="480px" src={previewUrl} unoptimized />
                <Button
                  type="button"
                  className="absolute bottom-4 right-4 bg-white/90 text-slate-800 hover:bg-white"
                  onClick={() => setShowFullPhoto(true)}
                >
                  🔍 View Full Photo
                </Button>
              </div>
            ) : (
              <div className="flex h-[360px] items-center justify-center px-8 text-center text-sm text-slate-500">Photo preview appears here after camera capture or upload.</div>
            )}
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white">
            <div className="relative aspect-[3/4] bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex items-center justify-center gap-4 bg-white p-6">
              <Button
                type="button"
                variant="outline"
                onClick={switchCamera}
              >
                🔄 Switch Camera
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCamera(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-brand-700 px-8 hover:bg-brand-800"
                onClick={capturePhoto}
              >
                📸 Capture Photo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Full Photo View Modal */}
      {showFullPhoto && previewUrl && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-4" onClick={() => setShowFullPhoto(false)}>
          <div className="relative max-h-[90vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="absolute -right-4 -top-4 rounded-full bg-white p-2 text-2xl text-slate-800 hover:bg-slate-100"
              onClick={() => setShowFullPhoto(false)}
            >
              ✕
            </button>
            <Image
              alt="Full size resident photo"
              className="rounded-2xl object-contain"
              fill
              sizes="90vw"
              src={previewUrl}
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}

