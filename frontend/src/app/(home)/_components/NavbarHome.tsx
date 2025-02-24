'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
} from "@heroui/dropdown";

import { Avatar } from '@heroui/avatar';
import {
    Search,
    X,
    Heart,
    ShoppingCart,
    Store,
    TrendingUp,
} from 'lucide-react';

import { Badge } from "@heroui/badge";

const SearchComponent = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [searchIconClicked, setSearchIconClicked] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | KeyboardEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
                setSelectedIndex(-1)

            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleClearSearch = () => {
        setSearchQuery("")
        setShowSuggestions(false)
        setSelectedIndex(-1)
    }

    const handleSearchFocus = () => {
        if (searchQuery) {
            setShowSuggestions(true)
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        setSelectedIndex(-1)
        if (e.target.value) {
            setShowSuggestions(true)
        } else {
            setShowSuggestions(false)
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion)
        setShowSuggestions(false)
        setSelectedIndex(-1)

    }
    const searchSuggestions = [
        "Apple",
        "Banana",
        "Cherry",
        "Date",
        "Elderberry",
        "Fig",
        "Grape",
        "Honeydew"
    ].filter(suggestion =>
        searchQuery && suggestion.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            if (selectedIndex < searchSuggestions.length - 1) {
                setSelectedIndex(selectedIndex + 1)
            }
        } else if (e.key === "ArrowUp") {
            if (selectedIndex > 0) {
                setSelectedIndex(selectedIndex - 1)
            }
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            const selectedSuggestion = searchSuggestions[selectedIndex]
            setSearchQuery(selectedSuggestion)
            setShowSuggestions(false)
            setSelectedIndex(-1)
        }
    }

    return (
        <div className={`${!searchIconClicked && 'hidden'}  md:flex justify-center flex-grow`}>
            <div className='relative w-full md:w-2/4' ref={searchRef}>
                <div className="flex w-full">
                    <div className="relative flex-grow">
                        <Input
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={handleSearchFocus}
                            onKeyDown={handleKeyDown}
                            className={`rounded-l-full ${searchQuery ? 'pl-12' : 'pl-3'} text-base pr-10 h-10 focus-visible:ring-0 focus-visible:ring-offset-0 border-r-0 bg-gray-50`}
                            placeholder="Search"
                        />
                        {searchQuery && (
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <Search className="w-4 h-4 mr-3" />
                            </div>
                        )}
                        {searchQuery && (
                            <div
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            >
                                <X className="w-8 h-8 text-gray-500" />
                            </div>
                        )}
                    </div>
                    <button className="px-6 bg-gray-200 border border-l-0 rounded-r-full hover:bg-gray-250 transition-colors">
                        <Search className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {showSuggestions && searchQuery && searchSuggestions.length > 0 && (
                    <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-50">
                        {searchSuggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedIndex === index ? 'bg-blue-100' : ''}`}
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                <Search className="w-4 h-4 mr-3 text-gray-400" />
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};



const ProfileDropdown = () => {
    return (
        <Dropdown>
            <DropdownTrigger>
                <Avatar
                    src={"https://i.pravatar.cc/300"}
                    className="w-9 h-9"
                />
            </DropdownTrigger>
            <DropdownMenu>
                <DropdownItem key="new">New file</DropdownItem>
                <DropdownItem key="copy">Copy link</DropdownItem>
                <DropdownItem key="edit">Edit file</DropdownItem>
                <DropdownItem key="delete" className="text-danger" color="danger">
                    Delete file
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};





export default function NavbarHome() {
    return (
        <nav className='md:px-10  px-4 py-4 flex top-0 fixed w-full items-center h-[70px] justify-between bg-white bg-opacity-80 backdrop-blur-md shadow-md z-50'>
            <div className='flex justify-between items-center w-full'>
                {/* Left section - Logo */}
                <div className="flex-none">
                    <Link href="/" className="flex items-center">
                        <h1 className='text-3xl font-semibold text-gray-800 dark:text-gray-100'>NextStore</h1>
                    </Link>
                </div>

                {/* Center section - Search */}
                <div className="flex-1 hidden md:block mx-8">
                    <SearchComponent />
                </div>

                {/* Right section - Navigation and Profile */}
                <div className='flex items-center gap-4'>
                    <div className="hidden md:flex items-center gap-6">

                        <Link href="/become-seller" className="flex gap-2 items-center hover:text-gray-600">
                            <Store strokeWidth={1} size={25} />
                            <span className="whitespace-nowrap">Become Seller</span>
                        </Link>
                        <Link href="/dashboard" className="flex gap-2 items-center hover:text-gray-600">
                            <TrendingUp strokeWidth={1} size={25} className='text-green-600' />
                            <p>Dashboard</p>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/wishlist" className="text-pink-600 ">
                                <Heart strokeWidth={1} fill="none" size={25} />
                            </Link>
                            <Link href="/cart" className="hover:text-gray-600">
                                <Badge color="danger" content={8} shape="circle">
                                    <ShoppingCart strokeWidth={1} fill="none" size={25} />
                                </Badge>
                            </Link>
                        </div>
                    </div>
                    <div className="border-l pl-4 ml-2">
                        <ProfileDropdown />
                    </div>
                </div>
            </div>
        </nav>
    );
}