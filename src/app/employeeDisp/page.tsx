import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import prisma from '@/lib/prisma'

export default async function EmployeeDashboard() {
  const employees = await prisma.employee.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatSalary = (salary: any) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Number(salary))
  }

  const getGenderColor = (gender: string) => {
    switch(gender.toLowerCase()) {
      case 'male': return 'bg-blue-100 text-blue-800'
      case 'female': return 'bg-pink-100 text-pink-800'
      default: return 'bg-purple-100 text-purple-800'
    }
  }

  const getMaritalStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'married': return 'bg-green-100 text-green-800'
      case 'bachelor': return 'bg-yellow-100 text-yellow-800'
      case 'has-family': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Employee Directory
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Comprehensive overview of all employees
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarFallback className="bg-indigo-500 text-white">
                    {getInitials(employee.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle>{employee.fullName}</CardTitle>
                  <CardDescription className="line-clamp-1">
                    {employee.workEmployedToDo}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p>{employee.age} years</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Salary</p>
                    <p className="font-medium">{formatSalary(employee.salary)}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Badge variant="outline" className={getGenderColor(employee.gender)}>
                    {employee.gender.toLowerCase()}
                  </Badge>
                  <Badge variant="outline" className={getMaritalStatusColor(employee.maritalStatus)}>
                    {employee.maritalStatus.replace('-', ' ').toLowerCase()}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>{employee.phoneNumber}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Aadhar Number</p>
                  <p className="font-mono text-sm">{employee.aadharNumber}</p>
                </div>
              </CardContent>
              
              <CardFooter className="text-sm text-muted-foreground">
                <p>
                  Joined on{' '}
                  {new Date(employee.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
