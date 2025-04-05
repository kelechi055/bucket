import Image from 'next/image';

export default function TrustedBy() {
  const avatars = [
    'https://i.pravatar.cc/305001',
    '/miles.jpg',
    '/sam.jpg',
    '/hans.jpg',
    '/kelechi.jpg',
  ];

  return (
    <div className="flex items-center space-x-3 mt-12">
      {/* Trusted By Text */}
      <p
        className="text-white text-lg font-medium"
        style={{ fontFamily: 'Inter' }}
      >
        Trusted By
      </p>

      {/* Avatar Group */}
      <div className="flex -space-x-4">
        {avatars.map((src, index) => (
          <div
            key={index}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white grayscale hover:grayscale-0 hover:z-10 hover:scale-110 transition-all duration-300"
          >
            <Image
              src={src}
              alt={`User ${index + 1}`}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        ))}

        {/* +100 bubble */}
        <div className="w-10 h-10 rounded-full bg-white text-black text-sm flex items-center justify-center border-2 border-white font-medium z-10">
          +50
        </div>
      </div>
    </div>
  );
}
