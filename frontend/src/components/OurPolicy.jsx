import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiExchangeFundsLine } from 'react-icons/ri';
import { TbRosetteDiscountCheckFilled } from 'react-icons/tb';
import { BiSupport } from 'react-icons/bi';
import { FaShippingFast } from 'react-icons/fa';

function OurPolicy() {
  const sectionRef = useRef(null);
  const _navigate = useNavigate();

  const policies = [
    {
      icon: <RiExchangeFundsLine className="w-6 h-6" />,
      title: 'Easy Exchange',
      benefit: '14-day exchange window',
      color: '#4F8CFF',
    },
    {
      icon: <TbRosetteDiscountCheckFilled className="w-6 h-6" />,
      title: '7-Day Returns',
      benefit: 'Full refund guarantee',
      color: '#4F8CFF',
    },
    {
      icon: <BiSupport className="w-6 h-6" />,
      title: '24/7 Support',
      benefit: 'Expert assistance always',
      color: '#4F8CFF',
    },
    {
      icon: <FaShippingFast className="w-6 h-6" />,
      title: 'Fast Shipping',
      benefit: 'Free over $50',
      color: '#4F8CFF',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="w-full py-12 px-4 md:px-8 bg-white dark:bg-[#0B0F1A]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Horizontal Flex Layout - Trust Badges */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 md:divide-x divide-gray-200 dark:divide-gray-700">
          {policies.map((policy, index) => (
            <div
              key={index}
              className="flex items-center gap-4 w-full md:flex-1 md:px-6 first:pl-0 last:pr-0"
            >
              {/* Icon Circle */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                style={{
                  backgroundColor: `${policy.color}20`,
                  color: policy.color,
                }}
              >
                {policy.icon}
              </div>

              {/* Text Content */}
              <div>
                <h3
                  className="text-gray-900 dark:text-white font-semibold text-sm md:text-base mb-0.5"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {policy.title}
                </h3>
                <p
                  className="text-gray-500 dark:text-gray-400 text-xs md:text-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {policy.benefit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OurPolicy;
