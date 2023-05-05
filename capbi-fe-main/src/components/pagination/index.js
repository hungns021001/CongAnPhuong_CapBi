import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import styles from "./index.module.css";
import cn from "classnames";
import { Text } from "@/constant";

function PaginatedItems({ setPaginate, totalPage }) {
   
    const [disabled, setDisable] = useState(1);
    const _onPageChange = (data) => {
        setDisable(data.selected + 1);
        setPaginate(data.selected + 1);
    };

    return (
        <>
            <ReactPaginate
                breakLabel="..."
                nextLabel={Text.pagination.after}
                onPageChange={_onPageChange}
                pageRangeDisplayed={2}
                pageCount={totalPage}
                previousLabel={Text.pagination.previous}
                renderOnZeroPageCount={null}
                containerClassName={cn(styles.pagination)}
                pageLinkClassName={cn(styles.pageNum, styles.number)}
                previousClassName={
                    disabled === 1
                        ? cn(styles.pageNum, styles.previous, styles.disabled)
                        : cn(styles.pageNum, styles.previous)
                }
                nextLinkClassName={
                    disabled === totalPage
                        ? cn(styles.pageNum, styles.next, styles.disabled)
                        : cn(styles.pageNum, styles.next)
                }
                activeLinkClassName={cn(styles.active)}
            />
        </>
    );
}

export default PaginatedItems;
