#!/usr/bin/env bash

# 30.01.2026 delfi-ch

# Description:
# Tests for the sysfind Backend via cURL + Bash

# Params:
# none

# Usage:
# <script>

# Returns:
# 0: All tests passed
# 1: All tests failed
# 2: Some tests failed

passcounter=0
failcounter=0
tempdir=$(mktemp -d)

run_a_test () {
    # $1 = Testnumber
    # $2 = Testdescription
    # $3 = Command to execute
    # $4 = Expected result

    echo "Test $1: $2"
    result=$3
    if [[ ${result} == "$4" ]]; then
        echo -e "Test $1: \e[32mPass\e[0m"
        passcounter=$(($passcounter + 1))
    else
        echo -e "Test $1: \e[31mFail\e[0m"
        echo -e "Test $1: Expected $4, got $result"
        failcounter=$(($failcounter + 1))
    fi
}

run_a_test_regex () {
    # $1 = Testnumber
    # $2 = Testdescription
    # $3 = Command to execute
    # $4 = Pattern to match

    echo "Test $1: $2"
    result=$3
    if [[ ${result} =~ $4 ]]; then
        echo -e "Test $1: \e[32mPass\e[0m"
        passcounter=$(($passcounter + 1))
    else
        echo -e "Test $1: \e[31mFail\e[0m"
        echo -e "Test $1: Expected pattern $4, got $result"
        failcounter=$(($failcounter + 1))
    fi
}

run_a_test 1 "Is GET / working?" "$(curl "http://localhost:3000/api/sysfind" --no-progress-meter)" "Hello World"

run_a_test 2 "Is Authentication working via GET /verify" "$(curl -b ${tempdir}/cookies http://localhost:3000/api/sysfind/verify --no-progress-meter)" "Unauthorized"



echo -e

echo -e "Total Tests: $(($passcounter + $failcounter))"
echo -e "\e[32mPass: \e[0m${passcounter}/$(($passcounter + $failcounter))"
echo -e "\e[31mFail: \e[0m${failcounter}/$(($passcounter + $failcounter))"

echo -e

if [[ $failcounter -eq 0 ]]; then
    echo -e "\e[32mAll Tests passed!\e[0m"
    exit 0
elif [[ $passcounter -eq 0 ]]; then 
    echo -e "\e[31mNo Tests passed!\e[0m"
    exit 1
else 
    echo -e "Some Tests passed!"
    exit 2
fi