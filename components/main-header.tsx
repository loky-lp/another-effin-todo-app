'use client'

import { Logo } from '@/components/icons'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/hooks/use-user'

export default function MainHeader() {
	const { isLoading, user, logout } = useUser()

	return (
		<div className="border-b p-4">
			<div className="max-w-7xl mx-auto flex justify-between items-center">
				<Logo className="size-8" />

				{isLoading || !user ? (
					<Skeleton className="size-8 rounded-full" />
				) : (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Avatar className="cursor-pointer hover:border">
							<AvatarFallback>{user.name.substring(0,2).toUpperCase()}</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56" align="start">
						<DropdownMenuItem onClick={logout}>
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				)}
			</div>
		</div>
	)
}
