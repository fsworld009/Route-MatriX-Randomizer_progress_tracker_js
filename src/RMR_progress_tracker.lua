-- load this script after loading RMR boot.lua

-- Copied from RMR AutoTracker.lua
local cpu = ew.cpu
local cWaitFrames = 120
local prevTitle = -1
local waitFrames = cWaitFrames

local function getTitle()
    local tmp = cpu[0x80FFC9] - 0x30
    if tmp < 0 then tmp = 1 end
    return tmp
end
-- Copied from RMR AutoTracker.lua end

-- Copied from RMR boot.lua
local addrItems = 0x7FFF00
local addrChecks = 0x7FFF60
local addrIFG = 0x7FFFAE
local cChecksPerTitle = 0x20
local cItems = 0x60
-- Copied from RMR boot.lua end

local prevProgress = {
    ["items"] = {},
    ["checks"] = {},
    ["currentGame"] = {},
    ["ifg"] = {},
}

local function isArrayChanged(arr1, arr2)
    if #arr1 ~= #arr2 then
        return true
    end
    -- Check each element
    for i = 1, #a1 do
        if arr1[i] ~= arr2[i] then
            return true
        end
    end
    return false
end


local function writeProgress(progress)
    local output = "window.RMRPTJS.progress={\n"

    -- items
    output = output .. '  "items": ['
    for i=1, #progress["items"] do
        output = output .. progress["items"][i]
        if (i ~= #progress["items"]) then
            output = output .. ","
        end
    end
    output = output .. "],\n"

    -- checks
    output = output .. '  "checks": ['
    for i=1, #progress["checks"] do
        output = output .. progress["checks"][i]
        if (i ~= #progress["checks"]) then
            output = output .. ","
        end
    end
    output = output .. "],\n"

    -- ifg
    output = output .. '  "ifg": ' .. progress["ifg"] .. ',\n'

    -- currentGame
    output = output .. '  "currentGame": ' .. progress["currentGame"] .. ',\n'

    output = output .. "}\n"

    local fh = io.open("progress.js","w")
    if fh then
        fh:write(output)
        fh:close()
    end
end

-- modified from AutoTracker
function getCurrentScreen(curTitle)
    local addrMap = {[1] = 0x7E00D1, [2] = 0x7E00D0, [3] = 0x7E00D0}
    return cpu[addrMap[curTitle]]
end


local function parseProgress(curTitle)
    progress = {
        ["items"] = {},
        ["checks"] = {},
        ["currentGame"] = {},
        ["ifg"] = {},
    }

    local updated = False

    -- items
    for i=0, cItems-1, 1 do
        table.insert(progress["items"], cpu[addrItems + i])
        if progress["items"][i] ~= prevProgress["items"][i] then
            updated = true
        end
    end

    -- checks
    for i=0, 3*cChecksPerTitle-1, 1 do
        table.insert(progress["checks"], cpu[addrChecks + i])
        if progress["checks"][i] ~= prevProgress["checks"][i] then
            updated = true
        end
    end

    progress["ifg"] = cpu[addrIFG]

    progress["currentGame"] = curTitle
    updated = updated or (progress["ifg"] ~= prevProgress["ifg"]) or (progress["currentGame"] ~= prevProgress["currentGame"])

    if updated then
        writeProgress(progress)
    end
    prevProgress = progress
end

-- curTitle & some main loop logic is modified from RMR AutoTracker.lua
while true do
    ew.frameadvance()

    local curTitle = getTitle()
    local screen = getCurrentScreen(curTitle)
    if prevTitle ~= curTitle then
        prevTitle = curTitle
        waitFrames = cWaitFrames
    end
    waitFrames = waitFrames - 1

    if waitFrames <= 0 then
        waitFrames = 10
        -- wait another cWaitFrames sec when still in title screen
        if screen == 0 then
            waitFrames = cWaitFrames
        -- don't process until entering stage select screen
        elseif screen == 2 then
            parseProgress(curTitle)
        end
    end
end